/**
 * ActiveStateDemo - アクティブ状態・ダークモードのデモ
 *
 * QItem の active プロパティと dark モードリストの使用例。
 */

import { useState } from 'react'
import type { FC } from 'react'
import {
  LayoutDashboard,
  Users,
  BarChart2,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import { QList, QItem, QItemSection, QItemLabel, QSeparator } from '../list'

/** ナビゲーションアイテムの型 */
interface NavItem {
  id: string
  icon: FC<{ size?: number; className?: string }>
  label: string
  badge?: number
}

/** ナビゲーションメインメニュー */
const mainNavItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
  { id: 'users', icon: Users, label: 'ユーザー管理', badge: 12 },
  { id: 'analytics', icon: BarChart2, label: '分析・レポート' },
  { id: 'files', icon: FolderOpen, label: 'ファイル管理', badge: 3 },
]

/** ナビゲーションフッターメニュー */
const footerNavItems: NavItem[] = [
  { id: 'settings', icon: Settings, label: '設定' },
  { id: 'help', icon: HelpCircle, label: 'ヘルプ' },
]

const ActiveStateDemo: FC = () => {
  /** 現在アクティブなアイテムの ID を管理する */
  const [activeId, setActiveId] = useState<string>('dashboard')

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ライトモード サイドバーナビゲーション */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          ライトモード（アクティブ状態）
        </h3>
        <div className="border rounded-xl overflow-hidden bg-card">
          <div className="px-4 py-4 border-b">
            <span className="text-sm font-semibold text-foreground">管理パネル</span>
          </div>
          <QList padding>
            <QItemLabel header>メインメニュー</QItemLabel>
            {mainNavItems.map((item) => (
              <QItem
                key={item.id}
                clickable
                active={activeId === item.id}
                activeClass="bg-primary/10 text-primary font-medium rounded-lg"
                onClick={() => setActiveId(item.id)}
                className="rounded-lg mx-1 mb-0.5"
              >
                <QItemSection avatar>
                  <item.icon
                    size={18}
                    className={
                      activeId === item.id
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel>{item.label}</QItemLabel>
                </QItemSection>
                {item.badge && (
                  <QItemSection side>
                    <span className="text-xs font-semibold bg-primary/10 text-primary rounded-full px-1.5 py-0.5">
                      {item.badge}
                    </span>
                  </QItemSection>
                )}
              </QItem>
            ))}

            <QSeparator spaced />
            <QItemLabel header>サポート</QItemLabel>

            {footerNavItems.map((item) => (
              <QItem
                key={item.id}
                clickable
                active={activeId === item.id}
                activeClass="bg-primary/10 text-primary font-medium rounded-lg"
                onClick={() => setActiveId(item.id)}
                className="rounded-lg mx-1 mb-0.5"
              >
                <QItemSection avatar>
                  <item.icon
                    size={18}
                    className={
                      activeId === item.id
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel>{item.label}</QItemLabel>
                </QItemSection>
              </QItem>
            ))}

            <QSeparator spaced />
            <QItem clickable className="rounded-lg mx-1 text-destructive hover:bg-destructive/10">
              <QItemSection avatar>
                <LogOut size={18} className="text-destructive" />
              </QItemSection>
              <QItemSection>
                <QItemLabel>ログアウト</QItemLabel>
              </QItemSection>
            </QItem>
          </QList>
        </div>
      </div>

      {/* ダークモード サイドバーナビゲーション */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          ダークモード（QList dark）
        </h3>
        <div className="rounded-xl overflow-hidden bg-slate-900">
          <div className="px-4 py-4 border-b border-white/10">
            <span className="text-sm font-semibold text-white">管理パネル</span>
          </div>
          <QList padding dark>
            <QItemLabel header>メインメニュー</QItemLabel>
            {mainNavItems.map((item) => (
              <QItem
                key={item.id}
                clickable
                dark
                active={activeId === item.id}
                activeClass="bg-white/15 text-white font-medium rounded-lg"
                onClick={() => setActiveId(item.id)}
                className="rounded-lg mx-1 mb-0.5 text-slate-300"
              >
                <QItemSection avatar>
                  <item.icon
                    size={18}
                    className={
                      activeId === item.id ? 'text-white' : 'text-slate-400'
                    }
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel>{item.label}</QItemLabel>
                </QItemSection>
                {item.badge && (
                  <QItemSection side>
                    <span className="text-xs font-semibold bg-white/10 text-slate-300 rounded-full px-1.5 py-0.5">
                      {item.badge}
                    </span>
                  </QItemSection>
                )}
              </QItem>
            ))}

            <QSeparator spaced dark />

            {footerNavItems.map((item) => (
              <QItem
                key={item.id}
                clickable
                dark
                active={activeId === item.id}
                activeClass="bg-white/15 text-white font-medium rounded-lg"
                onClick={() => setActiveId(item.id)}
                className="rounded-lg mx-1 mb-0.5 text-slate-300"
              >
                <QItemSection avatar>
                  <item.icon
                    size={18}
                    className={
                      activeId === item.id ? 'text-white' : 'text-slate-400'
                    }
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel>{item.label}</QItemLabel>
                </QItemSection>
              </QItem>
            ))}
          </QList>
        </div>
      </div>
    </div>
  )
}

export default ActiveStateDemo
