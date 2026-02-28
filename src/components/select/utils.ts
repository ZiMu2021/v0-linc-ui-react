/**
 * LSelect コンポーネント用ユーティリティ関数モジュール
 * オプションの正規化、値の比較、ラベル取得などの共通処理を提供する
 */

import type { NormalizedOption, SelectOption, SelectValue } from './types'

// ============================================================
// オプション正規化ユーティリティ
// ============================================================

/**
 * 文字列・数値・オブジェクト形式のオプションを統一形式に正規化する
 *
 * @param options - 正規化対象のオプション配列
 * @param optionLabel - ラベルフィールド名またはゲッター関数
 * @param optionValue - 値フィールド名またはゲッター関数
 * @param optionDisable - 無効フィールド名またはゲッター関数
 * @returns 正規化済みオプション配列
 */
export function normalizeOptions(
  options: SelectOption[] | string[] | number[],
  optionLabel: string | ((opt: SelectOption) => string) = 'label',
  optionValue: string | ((opt: SelectOption) => SelectValue) = 'value',
  optionDisable: string | ((opt: SelectOption) => boolean) = 'disable',
): NormalizedOption[] {
  return options.map((opt) => {
    // 文字列・数値の場合は自動的にオブジェクト形式に変換
    if (typeof opt === 'string' || typeof opt === 'number') {
      return {
        label: String(opt),
        value: opt,
        disable: false,
        original: opt,
      }
    }

    // オブジェクト形式の場合はフィールド名またはゲッター関数で取得
    const label =
      typeof optionLabel === 'function'
        ? optionLabel(opt)
        : (opt[optionLabel] as string) ?? String(opt)

    const value =
      typeof optionValue === 'function'
        ? optionValue(opt)
        : (opt[optionValue] as SelectValue) ?? null

    const disable =
      typeof optionDisable === 'function'
        ? optionDisable(opt)
        : Boolean(opt[optionDisable])

    return { label, value, disable, original: opt }
  })
}

// ============================================================
// 値比較ユーティリティ
// ============================================================

/**
 * 2つの値が等しいかどうかを比較する
 * オブジェクト同士の場合は value プロパティで比較
 *
 * @param a - 比較値 A
 * @param b - 比較値 B
 * @returns 等しい場合は true
 */
export function isValueEqual(a: SelectValue, b: SelectValue): boolean {
  if (a === b) return true

  // どちらかが null/undefined の場合
  if (a == null || b == null) return false

  // オブジェクト同士の比較（value プロパティで判断）
  if (typeof a === 'object' && typeof b === 'object') {
    const aVal = (a as SelectOption).value
    const bVal = (b as SelectOption).value
    return aVal === bVal
  }

  return false
}

/**
 * 指定した値が選択済みかどうかを確認する
 *
 * @param value - 確認対象の値
 * @param selected - 現在の選択値（単一または配列）
 * @returns 選択済みの場合は true
 */
export function isSelected(
  value: SelectValue,
  selected: SelectValue | SelectValue[],
): boolean {
  if (Array.isArray(selected)) {
    return selected.some((s) => isValueEqual(s, value))
  }
  return isValueEqual(value, selected)
}

// ============================================================
// 値フォーマットユーティリティ
// ============================================================

/**
 * 選択値からオプションのラベルを取得する
 * mapOptions が有効な場合に、値からラベルへのマッピングを行う
 *
 * @param value - 選択値
 * @param normalizedOptions - 正規化済みオプション一覧
 * @returns ラベル文字列
 */
export function getValueLabel(
  value: SelectValue,
  normalizedOptions: NormalizedOption[],
): string {
  // オブジェクトの場合は label プロパティを直接返す
  if (value !== null && typeof value === 'object') {
    return (value as SelectOption).label ?? String(value)
  }

  // プリミティブ値の場合はオプションから検索
  const matched = normalizedOptions.find((opt) => isValueEqual(opt.value, value))
  return matched ? matched.label : String(value ?? '')
}

/**
 * 選択値の表示テキストを生成する
 * 複数選択の場合はカンマ区切りで結合
 *
 * @param value - 選択値（単一または配列）
 * @param normalizedOptions - 正規化済みオプション一覧
 * @param useChips - チップ表示の場合は空文字列を返す
 * @returns 表示テキスト
 */
export function getDisplayText(
  value: SelectValue | SelectValue[],
  normalizedOptions: NormalizedOption[],
  useChips = false,
): string {
  if (useChips && Array.isArray(value)) return ''

  if (Array.isArray(value)) {
    return value.map((v) => getValueLabel(v, normalizedOptions)).join(', ')
  }

  if (value === null || value === undefined) return ''
  return getValueLabel(value, normalizedOptions)
}

// ============================================================
// emit-value / map-options ユーティリティ
// ============================================================

/**
 * emit-value モードで使用する
 * オプションオブジェクトから value プロパティを抽出する
 *
 * @param opt - 正規化済みオプション
 * @returns 抽出された値
 */
export function extractEmitValue(opt: NormalizedOption): SelectValue {
  return opt.value
}

/**
 * map-options モードで使用する
 * プリミティブ値からオプションオブジェクトを検索する
 *
 * @param value - 検索する値
 * @param normalizedOptions - 正規化済みオプション一覧
 * @returns 対応するオプション、または元の値
 */
export function mapValueToOption(
  value: SelectValue,
  normalizedOptions: NormalizedOption[],
): SelectValue {
  const matched = normalizedOptions.find((opt) => isValueEqual(opt.value, value))
  return matched ? matched.original as SelectValue : value
}

// ============================================================
// フィルターユーティリティ
// ============================================================

/**
 * デフォルトのフィルター関数
 * 大文字小文字を無視してラベルに部分一致検索を行う
 *
 * @param options - フィルター対象のオプション一覧
 * @param inputValue - 検索入力値
 * @returns フィルター後のオプション一覧
 */
export function defaultFilter(
  options: NormalizedOption[],
  inputValue: string,
): NormalizedOption[] {
  if (!inputValue.trim()) return options

  const needle = inputValue.toLowerCase()
  return options.filter((opt) => opt.label.toLowerCase().includes(needle))
}

// ============================================================
// キーボードナビゲーションユーティリティ
// ============================================================

/**
 * 現在のハイライトインデックスから次の有効なインデックスを計算する
 *
 * @param currentIndex - 現在のインデックス
 * @param options - オプション一覧
 * @param direction - 移動方向（1: 下、-1: 上）
 * @returns 次のインデックス
 */
export function getNextHighlightIndex(
  currentIndex: number,
  options: NormalizedOption[],
  direction: 1 | -1,
): number {
  const total = options.length
  if (total === 0) return -1

  let next = currentIndex + direction

  // 範囲外の場合は折り返す
  if (next < 0) next = total - 1
  if (next >= total) next = 0

  // 無効化されたオプションをスキップ（最大ループ回数を制限）
  let loopCount = 0
  while (options[next]?.disable && loopCount < total) {
    next += direction
    if (next < 0) next = total - 1
    if (next >= total) next = 0
    loopCount++
  }

  return options[next]?.disable ? -1 : next
}
