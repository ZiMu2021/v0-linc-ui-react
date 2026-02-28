/**
 * LSelect コンポーネント用カスタムフックモジュール
 * セレクトの状態管理、キーボードナビゲーション、
 * アウトサイドクリック検出などのロジックを提供する
 */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type { LSelectProps, NormalizedOption, SelectValue } from './types'
import {
  defaultFilter,
  getNextHighlightIndex,
  isSelected,
  normalizeOptions,
} from './utils'

// ============================================================
// アウトサイドクリック検出フック
// ============================================================

/**
 * 指定した要素の外側をクリックした際にコールバックを実行するフック
 *
 * @param callback - アウトサイドクリック時のコールバック
 * @returns 監視対象要素の ref
 */
export function useOutsideClick<T extends HTMLElement>(
  callback: () => void,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    /**
     * ドキュメント全体のマウスダウンイベントハンドラー
     * ref の要素の外側をクリックした場合にコールバックを実行
     */
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [callback])

  return ref
}

// ============================================================
// ドロップダウン位置計算フック
// ============================================================

/**
 * ドロップダウンの表示位置を計算するフック
 * ビューポートの上下スペースを考慮して最適な方向を決定する
 *
 * @param triggerRef - トリガー要素の ref
 * @param isOpen - ドロップダウンの開閉状態
 * @returns 表示位置（'bottom' | 'top'）
 */
export function useDropdownPosition(
  triggerRef: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
): 'bottom' | 'top' {
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom')

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current) return

      const rect = triggerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top

      // 下のスペースが 200px 未満かつ上のスペースの方が広い場合は上に表示
      setPosition(spaceBelow < 200 && spaceAbove > spaceBelow ? 'top' : 'bottom')
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, triggerRef])

  return position
}

// ============================================================
// セレクト状態管理フック
// ============================================================

/**
 * セレクト状態のアクション型
 */
type SelectAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_HIGHLIGHTED'; payload: number }
  | { type: 'SET_FILTERED'; payload: NormalizedOption[] }
  | { type: 'SET_FOCUSED'; payload: boolean }
  | { type: 'RESET_INPUT' }

/**
 * セレクト内部状態型
 */
interface SelectInternalState {
  isOpen: boolean
  isFocused: boolean
  inputValue: string
  highlightedIndex: number
  filteredOptions: NormalizedOption[]
}

/**
 * セレクト状態のリデューサー関数
 */
function selectReducer(
  state: SelectInternalState,
  action: SelectAction,
): SelectInternalState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true, highlightedIndex: -1 }
    case 'CLOSE':
      return { ...state, isOpen: false, highlightedIndex: -1 }
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen, highlightedIndex: -1 }
    case 'SET_INPUT':
      return { ...state, inputValue: action.payload }
    case 'SET_HIGHLIGHTED':
      return { ...state, highlightedIndex: action.payload }
    case 'SET_FILTERED':
      return { ...state, filteredOptions: action.payload }
    case 'SET_FOCUSED':
      return { ...state, isFocused: action.payload }
    case 'RESET_INPUT':
      return { ...state, inputValue: '' }
    default:
      return state
  }
}

// ============================================================
// メインセレクトロジックフック
// ============================================================

/**
 * LSelect のメインロジックを管理するカスタムフック
 * 状態管理、キーボードナビゲーション、オプション選択ロジックを提供する
 */
export function useLSelect<TMultiple extends boolean = false>(
  props: LSelectProps<TMultiple>,
) {
  const {
    value,
    onChange,
    options = [],
    multiple,
    useInput,
    emitValue,
    clearable,
    disabled,
    readonly,
    maxValues,
    optionLabel,
    optionValue,
    optionDisable,
    filterFn,
    onFilter,
    onPopupShow,
    onPopupHide,
    onFocus,
    onBlur,
  } = props

  // ----------------------------------------------------------
  // オプション正規化
  // ----------------------------------------------------------

  /** 正規化済みオプション一覧 */
  const normalizedOptions = normalizeOptions(
    options,
    optionLabel,
    optionValue,
    optionDisable,
  )

  // ----------------------------------------------------------
  // 内部状態
  // ----------------------------------------------------------

  const [state, dispatch] = useReducer(selectReducer, {
    isOpen: false,
    isFocused: false,
    inputValue: '',
    highlightedIndex: -1,
    filteredOptions: normalizedOptions,
  })

  // フィルター後のオプションを正規化オプション変更時に同期
  useEffect(() => {
    if (!state.inputValue) {
      dispatch({ type: 'SET_FILTERED', payload: normalizedOptions })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.length])

  // ----------------------------------------------------------
  // ドロップダウン開閉制御
  // ----------------------------------------------------------

  /**
   * ドロップダウンを開く
   */
  const openDropdown = useCallback(() => {
    if (disabled || readonly) return
    dispatch({ type: 'OPEN' })
    onPopupShow?.()
  }, [disabled, readonly, onPopupShow])

  /**
   * ドロップダウンを閉じる
   */
  const closeDropdown = useCallback(() => {
    dispatch({ type: 'CLOSE' })
    if (useInput) dispatch({ type: 'RESET_INPUT' })
    onPopupHide?.()
  }, [useInput, onPopupHide])

  /**
   * ドロップダウンのトグル
   */
  const toggleDropdown = useCallback(() => {
    if (state.isOpen) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }, [state.isOpen, openDropdown, closeDropdown])

  // ----------------------------------------------------------
  // オプション選択ロジック
  // ----------------------------------------------------------

  /**
   * オプションを選択する
   * 複数選択・単一選択・emitValue モードに対応
   */
  const selectOption = useCallback(
    (opt: NormalizedOption) => {
      if (opt.disable) return

      /** emit する値（emitValue モードでは value プロパティのみ、そうでなければ元のオプション） */
      const emitVal = emitValue ? opt.value : (opt.original as SelectValue)

      if (multiple) {
        const currentArray = (Array.isArray(value) ? value : []) as SelectValue[]

        if (isSelected(opt.value, currentArray)) {
          // 選択解除
          const next = currentArray.filter((v) => {
            const compareVal =
              typeof v === 'object' && v !== null ? (v as { value?: SelectValue }).value ?? v : v
            return compareVal !== opt.value
          })
          ;(onChange as (val: SelectValue[]) => void)(next)
        } else {
          // 最大選択数チェック
          if (maxValues !== undefined && currentArray.length >= maxValues) return

          ;(onChange as (val: SelectValue[]) => void)([...currentArray, emitVal])
        }
      } else {
        ;(onChange as (val: SelectValue) => void)(emitVal)
        closeDropdown()
      }
    },
    [value, onChange, multiple, emitValue, maxValues, closeDropdown],
  )

  // ----------------------------------------------------------
  // クリアロジック
  // ----------------------------------------------------------

  /**
   * 選択値をクリアする
   */
  const clearValue = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (multiple) {
        ;(onChange as (val: SelectValue[]) => void)([])
      } else {
        ;(onChange as (val: SelectValue) => void)(null)
      }
    },
    [onChange, multiple],
  )

  // ----------------------------------------------------------
  // 入力フィルターロジック
  // ----------------------------------------------------------

  /**
   * 検索入力値変更時の処理
   * カスタムフィルター関数またはデフォルトフィルターを適用する
   */
  const handleInputChange = useCallback(
    (inputVal: string) => {
      dispatch({ type: 'SET_INPUT', payload: inputVal })
      onFilter?.(inputVal)

      if (filterFn) {
        // カスタムフィルター関数を使用
        filterFn(inputVal, (updateFn) => {
          updateFn()
        })
      } else {
        // デフォルトフィルター
        const filtered = defaultFilter(normalizedOptions, inputVal)
        dispatch({ type: 'SET_FILTERED', payload: filtered })
      }

      if (!state.isOpen) openDropdown()
    },
    [filterFn, normalizedOptions, onFilter, state.isOpen, openDropdown],
  )

  // ----------------------------------------------------------
  // キーボードナビゲーション
  // ----------------------------------------------------------

  /**
   * キーボードイベントハンドラー
   * 矢印キー、Enter、Escape、Backspace に対応
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || readonly) return

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          if (!state.isOpen) {
            openDropdown()
          } else {
            const next = getNextHighlightIndex(
              state.highlightedIndex,
              state.filteredOptions,
              1,
            )
            dispatch({ type: 'SET_HIGHLIGHTED', payload: next })
          }
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (state.isOpen) {
            const next = getNextHighlightIndex(
              state.highlightedIndex,
              state.filteredOptions,
              -1,
            )
            dispatch({ type: 'SET_HIGHLIGHTED', payload: next })
          }
          break
        }
        case 'Enter': {
          e.preventDefault()
          if (state.isOpen && state.highlightedIndex >= 0) {
            const opt = state.filteredOptions[state.highlightedIndex]
            if (opt) selectOption(opt)
          } else if (!state.isOpen) {
            openDropdown()
          }
          break
        }
        case 'Escape': {
          e.preventDefault()
          closeDropdown()
          break
        }
        case 'Backspace': {
          // 複数選択・チップ表示時に最後の選択肢を削除
          if (multiple && !state.inputValue) {
            const currentArray = (Array.isArray(value) ? value : []) as SelectValue[]
            if (currentArray.length > 0) {
              ;(onChange as (val: SelectValue[]) => void)(
                currentArray.slice(0, -1),
              )
            }
          }
          break
        }
        case 'Tab': {
          if (state.isOpen) closeDropdown()
          break
        }
      }
    },
    [
      disabled,
      readonly,
      state.isOpen,
      state.highlightedIndex,
      state.filteredOptions,
      state.inputValue,
      openDropdown,
      closeDropdown,
      selectOption,
      multiple,
      value,
      onChange,
    ],
  )

  // ----------------------------------------------------------
  // フォーカス制御
  // ----------------------------------------------------------

  /**
   * フォーカスイベントハンドラー
   */
  const handleFocus = useCallback(() => {
    dispatch({ type: 'SET_FOCUSED', payload: true })
    onFocus?.()
  }, [onFocus])

  /**
   * ブラーイベントハンドラー
   */
  const handleBlur = useCallback(() => {
    dispatch({ type: 'SET_FOCUSED', payload: false })
    onBlur?.()
  }, [onBlur])

  // ----------------------------------------------------------
  // 派生状態
  // ----------------------------------------------------------

  /** クリアボタンを表示すべきかどうか */
  const showClear =
    clearable &&
    !disabled &&
    !readonly &&
    (Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined)

  return {
    state,
    normalizedOptions,
    dispatch,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    selectOption,
    clearValue,
    handleInputChange,
    handleKeyDown,
    handleFocus,
    handleBlur,
    showClear,
  }
}
