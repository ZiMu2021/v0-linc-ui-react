/**
 * BasicDemo - QList の基本使用例デモ
 *
 * ボーダーなし・ボーダーあり・Dense モードの3パターンを示す。
 */

import type { FC } from 'react'
import { Inbox, Send, Drafts, Delete, Star } from 'lucide-react'
import { QList, QItem, QItemSection, QItemLabel } from '../list'

/** デモ用のメニューアイテムデータ */
const menuItems = [
  { icon: Inbox, label: '受信トレイ', count: 4 },
  { icon: Star, label: 'スター付き', count: 0 },
  { icon: Send, label: '送信済み', count: 0 },
  { icon: Drafts, label: '下書き', count: 2 },
  { icon: Delete, label: 'ゴミ箱', count: 0 },
]

const BasicDemo: FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* ボーダーなし */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          デフォルト
        </h3>
        <QList>
          {menuItems.map((item) => (
            <QItem key={item.label} clickable>
              <QItemSection avatar>
                <item.icon size={20} className="text-muted-foreground" />
              </QItemSection>
              <QItemSection>
                <QItemLabel>{item.label}</QItemLabel>
              </QItemSection>
              {item.count > 0 && (
                <QItemSection side>
                  <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                    {item.count}
                  </span>
                </QItemSection>
              )}
            </QItem>
          ))}
        </QList>
      </div>

      {/* ボーダーあり */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          ボーダーあり
        </h3>
        <QList bordered>
          {menuItems.map((item) => (
            <QItem key={item.label} clickable>
              <QItemSection avatar>
                <item.icon size={20} className="text-muted-foreground" />
              </QItemSection>
              <QItemSection>
                <QItemLabel>{item.label}</QItemLabel>
              </QItemSection>
              {item.count > 0 && (
                <QItemSection side>
                  <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                    {item.count}
                  </span>
                </QItemSection>
              )}
            </QItem>
          ))}
        </QList>
      </div>

      {/* Dense モード */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          Dense モード
        </h3>
        <QList bordered dense>
          {menuItems.map((item) => (
            <QItem key={item.label} clickable>
              <QItemSection avatar>
                <item.icon size={16} className="text-muted-foreground" />
              </QItemSection>
              <QItemSection>
                <QItemLabel>{item.label}</QItemLabel>
              </QItemSection>
              {item.count > 0 && (
                <QItemSection side>
                  <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-1.5 py-0.5">
                    {item.count}
                  </span>
                </QItemSection>
              )}
            </QItem>
          ))}
        </QList>
      </div>
    </div>
  )
}

export default BasicDemo
