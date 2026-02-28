/**
 * LSelect コンポーネント
 * Quasar の QSelect を参考に設計した React + TypeScript 向けセレクトコンポーネント
 * filled / outlined / standout / borderless の4つのバリアントをサポートする
 */

import { useEffect, useRef } from 'react'
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDropdownPosition, useLSelect, useOutsideClick } from './hooks'
import type { LSelectProps, NormalizedOption, SelectValue } from './types'
import { getDisplayText, getValueLabel, isSelected } from './utils'

// ============================================================
// カラーマッピング定数
// ============================================================

/**
 * カラーテーマと Tailwind クラスのマッピング
 */
const COLOR_BORDER_FOCUS: Record<string, string> = {
  primary: 'focus-within:border-blue-600',
  secondary: 'focus-within:border-purple-600',
  accent: 'focus-within:border-amber-500',
  positive: 'focus-within:border-emerald-600',
  negative: 'focus-within:border-red-600',
  warning: 'focus-within:border-amber-600',
  info: 'focus-within:border-sky-600',
}

const COLOR_LABEL_FLOAT: Record<string, string> = {
  primary: 'text-blue-600',
  secondary: 'text-purple-600',
  accent: 'text-amber-500',
  positive: 'text-emerald-600',
  negative: 'text-red-600',
  warning: 'text-amber-600',
  info: 'text-sky-600',
}

const COLOR_UNDERLINE: Record<string, string> = {
  primary: 'after:bg-blue-600',
  secondary: 'after:bg-purple-600',
  accent: 'after:bg-amber-500',
  positive: 'after:bg-emerald-600',
  negative: 'after:bg-red-600',
  warning: 'after:bg-amber-600',
  info: 'after:bg-sky-600',
}

const COLOR_CHIP: Record<string, string> = {
  primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  secondary: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  accent: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  positive: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  negative: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
}

const COLOR_OPTION_CHECK: Record<string, string> = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-purple-600 dark:text-purple-400',
  accent: 'text-amber-500 dark:text-amber-400',
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-sky-600 dark:text-sky-400',
}

// ============================================================
// チップ（選択済みタグ）サブコンポーネント
// ============================================================

/**
 * 選択済み項目を表示するチップコンポーネント
 */
interface ChipProps {
  /** 表示ラベル */
  label: string
  /** 削除ボタンクリック時のコールバック */
  onRemove: (e: React.MouseEvent) => void
  /** disabled 状態 */
  disabled?: boolean
  /** カラーテーマ */
  color?: string
}

function SelectChip({ label, onRemove, disabled, color = 'primary' }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        'transition-opacity duration-150',
        COLOR_CHIP[color] ?? COLOR_CHIP.primary,
        disabled && 'opacity-60',
      )}
    >
      {label}
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label}を削除`}
          className="rounded-full hover:opacity-70 focus:outline-none focus:ring-1 focus:ring-current"
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}

// ============================================================
// オプションリストアイテムサブコンポーネント
// ============================================================

/**
 * ドロップダウン内の個別オプションアイテム
 */
interface OptionItemProps {
  /** オプションデータ */
  option: NormalizedOption
  /** 選択済みかどうか */
  isItemSelected: boolean
  /** ハイライト状態 */
  isHighlighted: boolean
  /** クリックハンドラー */
  onClick: () => void
  /** ホバーハンドラー */
  onMouseEnter: () => void
  /** カスタムレンダラー */
  renderOption?: (option: NormalizedOption, selected: boolean) => React.ReactNode
  /** カラーテーマ */
  color?: string
}

function OptionItem({
  option,
  isItemSelected,
  isHighlighted,
  onClick,
  onMouseEnter,
  renderOption,
  color = 'primary',
}: OptionItemProps) {
  return (
    <li
      role="option"
      aria-selected={isItemSelected}
      aria-disabled={option.disable}
      onClick={option.disable ? undefined : onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        'flex items-center justify-between px-4 py-2.5 cursor-pointer',
        'text-sm text-foreground select-none transition-colors duration-100',
        isHighlighted && !option.disable && 'bg-muted',
        isItemSelected && !option.disable && 'bg-accent font-medium',
        option.disable &&
          'opacity-40 cursor-not-allowed text-muted-foreground',
        !option.disable && !isHighlighted && !isItemSelected && 'hover:bg-muted/60',
      )}
    >
      {renderOption ? (
        renderOption(option, isItemSelected)
      ) : (
        <>
          <span className="flex-1 truncate">{option.label}</span>
          {isItemSelected && (
            <Check
              size={16}
              className={cn('ml-2 flex-shrink-0', COLOR_OPTION_CHECK[color] ?? COLOR_OPTION_CHECK.primary)}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </li>
  )
}

// ============================================================
// ローディングインジケーター
// ============================================================

/**
 * フィールド下部に表示するローディングバー
 */
function LoadingBar({ color = 'primary' }: { color?: string }) {
  const barColors: Record<string, string> = {
    primary: 'bg-blue-600',
    secondary: 'bg-purple-600',
    accent: 'bg-amber-500',
    positive: 'bg-emerald-600',
    negative: 'bg-red-600',
    warning: 'bg-amber-600',
    info: 'bg-sky-600',
  }
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b">
      <div
        className={cn(
          'h-full w-1/2 animate-[slide-bar_1.5s_ease-in-out_infinite]',
          barColors[color] ?? barColors.primary,
        )}
      />
    </div>
  )
}

// ============================================================
// メインコンポーネント
// ============================================================

/**
 * LSelect - Quasar の QSelect 相当の React セレクトコンポーネント
 *
 * @example
 * // 単一選択（outlined バリアント）
 * <LSelect
 *   label="フルーツを選択"
 *   options={['リンゴ', 'バナナ', 'オレンジ']}
 *   value={selected}
 *   onChange={setSelected}
 * />
 *
 * @example
 * // 複数選択 + チップ表示 + 検索
 * <LSelect
 *   label="複数選択"
 *   options={options}
 *   value={selectedArray}
 *   onChange={setSelectedArray}
 *   multiple
 *   useChips
 *   useInput
 *   clearable
 * />
 */
export function LSelect<TMultiple extends boolean = false>(
  props: LSelectProps<TMultiple>,
) {
  const {
    label,
    placeholder,
    hint,
    error,
    variant = 'outlined',
    color = 'primary',
    prependIcon,
    appendIcon,
    fullWidth = false,
    rounded = false,
    stackLabel = false,
    multiple,
    useInput = false,
    useChips = false,
    clearable = false,
    disabled = false,
    readonly = false,
    loading = false,
    counter = false,
    maxValues,
    behavior = 'menu',
    dropdownMaxHeight = '60vh',
    renderOption,
    renderSelected,
    className,
    ariaLabel,
    id,
  } = props

  // ----------------------------------------------------------
  // フック呼び出し
  // ----------------------------------------------------------

  const {
    state,
    normalizedOptions,
    dispatch,
    toggleDropdown,
    closeDropdown,
    selectOption,
    clearValue,
    handleInputChange,
    handleKeyDown,
    handleFocus,
    handleBlur,
    showClear,
  } = useLSelect(props)

  /** コンテナ要素への ref（アウトサイドクリック検出用） */
  const containerRef = useOutsideClick<HTMLDivElement>(closeDropdown)

  /** トリガー要素への ref（ドロップダウン位置計算用） */
  const triggerRef = useRef<HTMLDivElement | null>(null)

  /** 検索入力要素への ref */
  const inputRef = useRef<HTMLInputElement | null>(null)

  /** オプションリスト要素への ref（スクロール制御用） */
  const listRef = useRef<HTMLUListElement | null>(null)

  /** ドロップダウン表示位置 */
  const dropdownPosition = useDropdownPosition(triggerRef, state.isOpen)

  // ----------------------------------------------------------
  // 入力フォーカス制御
  // ----------------------------------------------------------

  /** ドロップダウンが開いたら入力フィールドにフォーカス */
  useEffect(() => {
    if (state.isOpen && useInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [state.isOpen, useInput])

  // ----------------------------------------------------------
  // ハイライト項目のスクロール制御
  // ----------------------------------------------------------

  /** キーボードナビゲーション時にハイライト項目を可視領域にスクロール */
  useEffect(() => {
    if (state.highlightedIndex < 0 || !listRef.current) return
    const item = listRef.current.children[state.highlightedIndex] as HTMLElement
    item?.scrollIntoView({ block: 'nearest' })
  }, [state.highlightedIndex])

  // ----------------------------------------------------------
  // 選択値の表示テキスト取得
  // ----------------------------------------------------------

  const displayText = getDisplayText(props.value, normalizedOptions, useChips && !!multiple)
  const selectedArray = Array.isArray(props.value) ? props.value : []

  /** ラベルが浮き上がった状態かどうか */
  const isLabelFloated =
    stackLabel ||
    state.isFocused ||
    state.isOpen ||
    (Array.isArray(props.value)
      ? props.value.length > 0
      : props.value !== null && props.value !== undefined)

  // ----------------------------------------------------------
  // スタイル計算
  // ----------------------------------------------------------

  /** フォーカスカラークラス */
  const focusBorderColor = error
    ? 'focus-within:border-red-500'
    : COLOR_BORDER_FOCUS[color] ?? COLOR_BORDER_FOCUS.primary

  /** ラベルカラークラス（フォーカス時） */
  const labelColor = error
    ? 'text-red-500'
    : (state.isFocused || state.isOpen) && isLabelFloated
      ? (COLOR_LABEL_FLOAT[color] ?? COLOR_LABEL_FLOAT.primary)
      : 'text-muted-foreground'

  /** アンダーライン展開クラス（filled / standout 用） */
  const underlineColor = error
    ? 'after:bg-red-500'
    : COLOR_UNDERLINE[color] ?? COLOR_UNDERLINE.primary

  // ----------------------------------------------------------
  // バリアント別コンテナクラス
  // ----------------------------------------------------------

  const variantClasses: Record<string, string> = {
    filled: cn(
      'bg-muted/60 border-0 border-b-2 border-border',
      'relative',
      // アンダーライン展開アニメーション
      'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
      'after:scale-x-0 focus-within:after:scale-x-100',
      'after:transition-transform after:duration-300 after:origin-center',
      underlineColor,
      rounded ? 'rounded-t-lg' : 'rounded-none',
    ),
    outlined: cn(
      'bg-transparent border border-border rounded-[inherit]',
      focusBorderColor,
      'transition-colors duration-200',
      error && 'border-red-500',
    ),
    standout: cn(
      'bg-muted/40 border-0 shadow-sm',
      'transition-all duration-200',
      'focus-within:bg-background focus-within:shadow-md',
      rounded ? 'rounded-lg' : 'rounded-md',
    ),
    borderless: cn('bg-transparent border-0'),
  }

  // ----------------------------------------------------------
  // ダイアログモード
  // ----------------------------------------------------------

  const isDialogMode = behavior === 'dialog'

  // ----------------------------------------------------------
  // レンダリング
  // ----------------------------------------------------------

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        fullWidth ? 'w-full' : 'inline-flex min-w-48 max-w-xs w-full',
        disabled && 'opacity-60 cursor-not-allowed',
        className,
      )}
      style={{ '--select-rounded': rounded ? '9999px' : '0.375rem' } as React.CSSProperties}
    >
      {/* --------------------------------------------------------
          フィールドラッパー
          -------------------------------------------------------- */}
      <div
        ref={triggerRef}
        role="combobox"
        aria-expanded={state.isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        aria-readonly={readonly}
        aria-label={ariaLabel ?? label}
        aria-controls={id ? `${id}-listbox` : undefined}
        tabIndex={disabled || useInput ? -1 : 0}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={disabled || readonly ? undefined : toggleDropdown}
        className={cn(
          'group relative flex items-center gap-2 px-3 min-h-14 w-full cursor-pointer',
          'transition-all duration-200',
          variantClasses[variant],
          rounded && 'rounded-full px-5',
          disabled && 'pointer-events-none',
          readonly && 'pointer-events-none',
        )}
      >
        {/* 前置アイコン */}
        {prependIcon && (
          <span className="flex-shrink-0 text-muted-foreground" aria-hidden="true">
            {prependIcon}
          </span>
        )}

        {/* ラベル + 選択値エリア */}
        <div className="relative flex-1 min-w-0 py-2">
          {/* フローティングラベル */}
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'absolute left-0 pointer-events-none select-none',
                'transition-all duration-200 ease-out',
                isLabelFloated
                  ? cn('text-xs -top-0.5 font-medium', labelColor)
                  : 'text-sm top-1/2 -translate-y-1/2 text-muted-foreground',
              )}
            >
              {label}
            </label>
          )}

          {/* 選択値表示 / 検索入力エリア */}
          <div
            className={cn(
              'flex flex-wrap items-center gap-1.5 min-h-6',
              label ? 'mt-3.5' : 'mt-0',
            )}
          >
            {/* チップ表示（複数選択 + useChips）*/}
            {useChips &&
              multiple &&
              selectedArray.map((val, idx) => {
                const optLabel = getValueLabel(val as SelectValue, normalizedOptions)
                return (
                  <SelectChip
                    key={idx}
                    label={optLabel}
                    color={color}
                    disabled={disabled || readonly}
                    onRemove={(e) => {
                      e.stopPropagation()
                      const next = selectedArray.filter((_, i) => i !== idx)
                      ;(props.onChange as (v: SelectValue[]) => void)(next)
                    }}
                  />
                )
              })}

            {/* 選択値テキスト表示 */}
            {!useInput && displayText && (
              <span className="text-sm text-foreground truncate">
                {renderSelected ? renderSelected(props.value as SelectValue) : displayText}
              </span>
            )}

            {/* 複数選択カウンター（counter モード） */}
            {counter && multiple && selectedArray.length > 0 && !useChips && (
              <span className="text-xs text-muted-foreground ml-1">
                {selectedArray.length}
                {maxValues ? `/${maxValues}` : ''}件選択中
              </span>
            )}

            {/* プレースホルダー */}
            {!displayText && !useInput && !useChips && placeholder && (
              <span className="text-sm text-muted-foreground/70">{placeholder}</span>
            )}

            {/* 検索入力フィールド（useInput モード） */}
            {useInput && (
              <input
                ref={inputRef}
                id={id}
                type="text"
                value={state.inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={
                  !displayText && !selectedArray.length ? (placeholder ?? '') : ''
                }
                disabled={disabled}
                readOnly={readonly}
                aria-autocomplete="list"
                aria-label={label ?? ariaLabel}
                className={cn(
                  'flex-1 min-w-20 bg-transparent outline-none border-none',
                  'text-sm text-foreground placeholder:text-muted-foreground/70',
                  'cursor-text',
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!state.isOpen) {
                    dispatch({ type: 'OPEN' })
                    props.onPopupShow?.()
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* クリアボタン */}
        {showClear && (
          <button
            type="button"
            onClick={clearValue}
            aria-label="選択をクリア"
            className={cn(
              'flex-shrink-0 p-0.5 rounded-full text-muted-foreground',
              'hover:text-foreground hover:bg-muted transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-ring',
            )}
          >
            <X size={16} />
          </button>
        )}

        {/* ローディングアイコン */}
        {loading && (
          <Loader2
            size={18}
            className="flex-shrink-0 text-muted-foreground animate-spin"
            aria-label="読み込み中"
          />
        )}

        {/* 後置アイコン / ドロップダウン矢印 */}
        {appendIcon ? (
          <span className="flex-shrink-0 text-muted-foreground" aria-hidden="true">
            {appendIcon}
          </span>
        ) : (
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={cn(
              'flex-shrink-0 text-muted-foreground transition-transform duration-200',
              state.isOpen && 'rotate-180',
            )}
          />
        )}

        {/* ローディングバー（filled / standout 用） */}
        {loading && (variant === 'filled' || variant === 'standout') && (
          <LoadingBar color={color} />
        )}
      </div>

      {/* --------------------------------------------------------
          ヒント / エラーメッセージ
          -------------------------------------------------------- */}
      {(hint || error) && (
        <div
          className={cn(
            'mt-1 px-3 text-xs',
            error ? 'text-red-500' : 'text-muted-foreground',
          )}
          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </div>
      )}

      {/* --------------------------------------------------------
          ドロップダウン（メニューモード）
          -------------------------------------------------------- */}
      {state.isOpen && !isDialogMode && (
        <div
          className={cn(
            'absolute left-0 right-0 z-50',
            'bg-popover border border-border rounded-lg shadow-lg',
            'overflow-hidden',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            dropdownPosition === 'bottom'
              ? 'top-full mt-1 origin-top'
              : 'bottom-full mb-1 origin-bottom',
          )}
          style={{ maxHeight: dropdownMaxHeight }}
        >
          {/* 検索アイコン（useInput かつ独立表示の場合） */}
          {useInput && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60">
              <Search size={14} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">フィルター中...</span>
            </div>
          )}

          <ul
            ref={listRef}
            role="listbox"
            id={id ? `${id}-listbox` : undefined}
            aria-multiselectable={multiple}
            aria-label={label ?? ariaLabel ?? 'オプション'}
            className="overflow-y-auto py-1"
            style={{ maxHeight: dropdownMaxHeight }}
          >
            {state.filteredOptions.length === 0 ? (
              <li className="px-4 py-6 text-sm text-muted-foreground text-center">
                オプションが見つかりません
              </li>
            ) : (
              state.filteredOptions.map((opt, idx) => (
                <OptionItem
                  key={`${opt.value}-${idx}`}
                  option={opt}
                  isItemSelected={isSelected(
                    opt.value,
                    multiple
                      ? (props.value as SelectValue[])
                      : (props.value as SelectValue),
                  )}
                  isHighlighted={state.highlightedIndex === idx}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() =>
                    dispatch({ type: 'SET_HIGHLIGHTED', payload: idx })
                  }
                  renderOption={
                    renderOption
                      ? (o, s) => renderOption(o, s)
                      : undefined
                  }
                  color={color}
                />
              ))
            )}
          </ul>
        </div>
      )}

      {/* --------------------------------------------------------
          ドロップダウン（ダイアログモード）
          -------------------------------------------------------- */}
      {state.isOpen && isDialogMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label ?? 'オプションを選択'}
          className={cn(
            'fixed inset-0 z-50 flex items-end sm:items-center justify-center',
            'bg-black/50 backdrop-blur-sm',
            'animate-in fade-in-0 duration-200',
          )}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDropdown()
          }}
        >
          <div
            className={cn(
              'bg-popover border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl',
              'w-full sm:max-w-sm mx-0 sm:mx-4',
              'animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200',
            )}
          >
            {/* ダイアログヘッダー */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-medium text-foreground text-sm">{label ?? 'オプションを選択'}</span>
              <button
                type="button"
                onClick={closeDropdown}
                aria-label="閉じる"
                className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* ダイアログ内検索 */}
            {useInput && (
              <div className="px-4 py-2 border-b border-border/60">
                <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-2">
                  <Search size={16} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={state.inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="検索..."
                    className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <ul
              ref={listRef}
              role="listbox"
              aria-multiselectable={multiple}
              className="overflow-y-auto py-1"
              style={{ maxHeight: '50vh' }}
            >
              {state.filteredOptions.length === 0 ? (
                <li className="px-4 py-6 text-sm text-muted-foreground text-center">
                  オプションが見つかりません
                </li>
              ) : (
                state.filteredOptions.map((opt, idx) => (
                  <OptionItem
                    key={`${opt.value}-${idx}`}
                    option={opt}
                    isItemSelected={isSelected(
                      opt.value,
                      multiple
                        ? (props.value as SelectValue[])
                        : (props.value as SelectValue),
                    )}
                    isHighlighted={state.highlightedIndex === idx}
                    onClick={() => selectOption(opt)}
                    onMouseEnter={() =>
                      dispatch({ type: 'SET_HIGHLIGHTED', payload: idx })
                    }
                    renderOption={
                      renderOption
                        ? (o, s) => renderOption(o, s)
                        : undefined
                    }
                    color={color}
                  />
                ))
              )}
            </ul>

            {/* 複数選択時の完了ボタン */}
            {multiple && (
              <div className="px-4 py-3 border-t border-border">
                <button
                  type="button"
                  onClick={closeDropdown}
                  className={cn(
                    'w-full py-2 px-4 rounded-lg text-sm font-medium',
                    'bg-primary text-primary-foreground',
                    'hover:opacity-90 transition-opacity',
                    'focus:outline-none focus:ring-2 focus:ring-ring',
                  )}
                >
                  完了（{selectedArray.length}件選択中）
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LSelect
