/**
 * ListContext - QList コンポーネント群のコンテキスト定義
 *
 * 親の QList から子コンポーネント（QItem, QItemSection など）へ
 * dense / dark / separator の状態を伝播するためのコンテキスト。
 */

import { createContext, useContext } from 'react'
import type { ListContextValue } from './types'

/** デフォルトのコンテキスト値 */
const defaultListContext: ListContextValue = {
  dense: false,
  dark: false,
  separator: false,
}

/** List コンポーネント共通コンテキスト */
export const ListContext = createContext<ListContextValue>(defaultListContext)

/**
 * useListContext - ListContext を取得するカスタムフック
 *
 * @returns ListContextValue - dense / dark / separator の状態
 */
export const useListContext = (): ListContextValue => {
  return useContext(ListContext)
}
