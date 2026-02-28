/**
 * ContactListDemo - 連絡先リストのデモ
 *
 * QItemSection(avatar) + 複数行ラベル + サイドセクションの組み合わせ例。
 * Quasar ドキュメントの "Contact list" サンプルに相当する。
 */

import type { FC } from 'react'
import { Phone, Video, MoreVertical } from 'lucide-react'
import { QList, QItem, QItemSection, QItemLabel, QSeparator } from '../list'
import QAvatar from '../list/QAvatar'

/** 連絡先データ型 */
interface Contact {
  id: number
  /** 表示名 */
  name: string
  /** 電話番号 */
  phone: string
  /** 最終連絡日時 */
  lastSeen: string
  /** アバターの頭文字 */
  initials: string
  /** アバターのカラー */
  color: 'primary' | 'success' | 'warning' | 'error' | 'accent'
  /** オンラインかどうか */
  online: boolean
}

/** デモ用の連絡先データ */
const contacts: Contact[] = [
  {
    id: 1,
    name: '山田 太郎',
    phone: '090-1234-5678',
    lastSeen: '今オンライン',
    initials: '山',
    color: 'primary',
    online: true,
  },
  {
    id: 2,
    name: '佐藤 花子',
    phone: '080-9876-5432',
    lastSeen: '1時間前',
    initials: '佐',
    color: 'success',
    online: false,
  },
  {
    id: 3,
    name: '鈴木 一郎',
    phone: '070-5555-1234',
    lastSeen: '昨日',
    initials: '鈴',
    color: 'warning',
    online: false,
  },
  {
    id: 4,
    name: '田中 美咲',
    phone: '090-3333-7777',
    lastSeen: '今オンライン',
    initials: '田',
    color: 'error',
    online: true,
  },
  {
    id: 5,
    name: '伊藤 健太',
    phone: '080-2222-8888',
    lastSeen: '2日前',
    initials: '伊',
    color: 'accent',
    online: false,
  },
]

const ContactListDemo: FC = () => {
  return (
    <QList bordered separator>
      {contacts.map((contact, index) => (
        <div key={contact.id}>
          {/* セクションヘッダー（名前の頭文字でグループ化） */}
          {index === 0 && (
            <QItemLabel header>よく連絡する相手</QItemLabel>
          )}

          <QItem clickable>
            {/* アバターセクション */}
            <QItemSection avatar>
              <div className="relative">
                <QAvatar color={contact.color} size="md">
                  {contact.initials}
                </QAvatar>
                {/* オンラインインジケーター */}
                {contact.online && (
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"
                    aria-label="オンライン"
                  />
                )}
              </div>
            </QItemSection>

            {/* メインセクション */}
            <QItemSection>
              <QItemLabel>{contact.name}</QItemLabel>
              <QItemLabel caption>{contact.phone}</QItemLabel>
              <QItemLabel caption>
                <span
                  className={contact.online ? 'text-emerald-500' : undefined}
                >
                  {contact.lastSeen}
                </span>
              </QItemLabel>
            </QItemSection>

            {/* アクションセクション */}
            <QItemSection side top>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="電話をかける"
                >
                  <Phone size={16} />
                </button>
                <button
                  className="p-1.5 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="ビデオ通話"
                >
                  <Video size={16} />
                </button>
                <button
                  className="p-1.5 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="その他のオプション"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </QItemSection>
          </QItem>

          {/* 最後のアイテム以外にセパレーターは不要（QList separator で付与されるため） */}
        </div>
      ))}
    </QList>
  )
}

export default ContactListDemo
