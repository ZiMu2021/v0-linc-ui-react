/**
 * SettingsDemo - 設定リストのデモ
 *
 * QSeparator のインセット・セクションヘッダー・トグルスイッチを
 * 組み合わせた設定画面の例。Quasar ドキュメントの "Settings" サンプルに相当する。
 */

import { useState } from 'react'
import type { FC } from 'react'
import {
  Bell,
  Moon,
  Globe,
  Lock,
  Shield,
  Wifi,
  Battery,
  Volume2,
  ChevronRight,
} from 'lucide-react'
import { QList, QItem, QItemSection, QItemLabel, QSeparator } from '../list'

/** トグル設定アイテムの型 */
interface ToggleItem {
  id: string
  icon: FC<{ size?: number; className?: string }>
  label: string
  description: string
  defaultValue?: boolean
}

/** リンク設定アイテムの型 */
interface LinkItem {
  icon: FC<{ size?: number; className?: string }>
  label: string
  value?: string
}

/** トグル設定データ */
const toggleItems: ToggleItem[] = [
  {
    id: 'notifications',
    icon: Bell,
    label: '通知',
    description: 'プッシュ通知を受け取る',
    defaultValue: true,
  },
  {
    id: 'darkMode',
    icon: Moon,
    label: 'ダークモード',
    description: 'ダークテーマに切り替える',
    defaultValue: false,
  },
  {
    id: 'wifi',
    icon: Wifi,
    label: 'Wi-Fi',
    description: 'ワイヤレスネットワークに接続',
    defaultValue: true,
  },
  {
    id: 'battery',
    icon: Battery,
    label: 'バッテリーセーバー',
    description: '省電力モードを有効にする',
    defaultValue: false,
  },
]

/** リンク設定データ */
const linkItems: LinkItem[] = [
  { icon: Globe, label: '言語', value: '日本語' },
  { icon: Lock, label: 'プライバシー' },
  { icon: Shield, label: 'セキュリティ' },
  { icon: Volume2, label: 'サウンド', value: '中' },
]

/**
 * シンプルなトグルスイッチコンポーネント
 */
const Toggle: FC<{ checked: boolean; onChange: (val: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <button
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      checked ? 'bg-primary' : 'bg-muted'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
)

const SettingsDemo: FC = () => {
  /** 各トグルの状態を管理する */
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>(
    Object.fromEntries(
      toggleItems.map((item) => [item.id, item.defaultValue ?? false])
    )
  )

  const handleToggle = (id: string, value: boolean) => {
    setToggleValues((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <QList bordered>
      {/* トグル設定セクション */}
      <QItemLabel header>一般設定</QItemLabel>

      {toggleItems.map((item, index) => (
        <div key={item.id}>
          <QItem>
            <QItemSection avatar>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon size={18} className="text-primary" />
              </div>
            </QItemSection>
            <QItemSection>
              <QItemLabel>{item.label}</QItemLabel>
              <QItemLabel caption>{item.description}</QItemLabel>
            </QItemSection>
            <QItemSection side>
              <Toggle
                checked={toggleValues[item.id]}
                onChange={(val) => handleToggle(item.id, val)}
                label={item.label}
              />
            </QItemSection>
          </QItem>
          {index < toggleItems.length - 1 && (
            <QSeparator inset="item" />
          )}
        </div>
      ))}

      {/* リンク設定セクション */}
      <QSeparator spaced />
      <QItemLabel header>詳細設定</QItemLabel>

      {linkItems.map((item, index) => (
        <div key={item.label}>
          <QItem clickable>
            <QItemSection avatar>
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <item.icon size={18} className="text-secondary-foreground" />
              </div>
            </QItemSection>
            <QItemSection>
              <QItemLabel>{item.label}</QItemLabel>
            </QItemSection>
            <QItemSection side>
              <div className="flex items-center gap-1 text-muted-foreground">
                {item.value && (
                  <span className="text-sm">{item.value}</span>
                )}
                <ChevronRight size={16} />
              </div>
            </QItemSection>
          </QItem>
          {index < linkItems.length - 1 && (
            <QSeparator inset="item" />
          )}
        </div>
      ))}
    </QList>
  )
}

export default SettingsDemo
