/**
 * FolderListDemo - フォルダ・ファイル一覧のデモ
 *
 * QItemLabel の overline / caption / lines と thumbnail セクションを
 * 組み合わせたファイルマネージャー風の一覧表示例。
 */

import { useState } from 'react'
import type { FC } from 'react'
import {
  Folder,
  FileText,
  Image,
  Music,
  Video,
  Archive,
  MoreVertical,
  ChevronRight,
} from 'lucide-react'
import { QList, QItem, QItemSection, QItemLabel, QSeparator } from '../list'

/** ファイル/フォルダの型 */
interface FileItem {
  id: number
  name: string
  type: 'folder' | 'document' | 'image' | 'audio' | 'video' | 'archive'
  size?: string
  modified: string
  items?: number
}

/** フォルダデータ */
const folders: FileItem[] = [
  {
    id: 1,
    name: 'プロジェクト',
    type: 'folder',
    modified: '今日',
    items: 24,
  },
  {
    id: 2,
    name: 'デザインアセット',
    type: 'folder',
    modified: '昨日',
    items: 87,
  },
  {
    id: 3,
    name: 'バックアップ',
    type: 'folder',
    modified: '先週',
    items: 3,
  },
]

/** ファイルデータ */
const files: FileItem[] = [
  {
    id: 4,
    name: '要件定義書.pdf',
    type: 'document',
    size: '2.4 MB',
    modified: '今日 14:32',
  },
  {
    id: 5,
    name: 'ワイヤーフレーム.png',
    type: 'image',
    size: '8.1 MB',
    modified: '昨日 09:15',
  },
  {
    id: 6,
    name: 'プレゼンテーション.mp4',
    type: 'video',
    size: '124 MB',
    modified: '月曜日',
  },
  {
    id: 7,
    name: 'BGM.mp3',
    type: 'audio',
    size: '5.7 MB',
    modified: '先週',
  },
  {
    id: 8,
    name: 'ソースコード.zip',
    type: 'archive',
    size: '31.2 MB',
    modified: '先月',
  },
]

/** ファイルタイプに応じたアイコンとカラーを取得する */
const getFileStyle = (type: FileItem['type']) => {
  const styles: Record<
    FileItem['type'],
    { Icon: FC<{ size?: number; className?: string }>; color: string; bg: string }
  > = {
    folder: { Icon: Folder, color: 'text-amber-500', bg: 'bg-amber-50' },
    document: { Icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    image: { Icon: Image, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    audio: { Icon: Music, color: 'text-violet-500', bg: 'bg-violet-50' },
    video: { Icon: Video, color: 'text-rose-500', bg: 'bg-rose-50' },
    archive: { Icon: Archive, color: 'text-orange-500', bg: 'bg-orange-50' },
  }
  return styles[type]
}

const FolderListDemo: FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const renderItem = (item: FileItem, isLast: boolean) => {
    const { Icon, color, bg } = getFileStyle(item.type)
    const isSelected = selectedId === item.id

    return (
      <div key={item.id}>
        <QItem
          clickable
          active={isSelected}
          activeClass="bg-primary/8"
          onClick={() => setSelectedId(isSelected ? null : item.id)}
        >
          {/* アイコンセクション */}
          <QItemSection avatar>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
          </QItemSection>

          {/* メインセクション */}
          <QItemSection>
            <QItemLabel
              className={isSelected ? 'text-primary font-medium' : undefined}
            >
              {item.name}
            </QItemLabel>
            <QItemLabel caption>
              {item.type === 'folder'
                ? `${item.items} 個のアイテム`
                : item.size}
            </QItemLabel>
          </QItemSection>

          {/* サイドセクション */}
          <QItemSection side>
            <div className="flex items-center gap-2">
              <QItemLabel caption>{item.modified}</QItemLabel>
              {item.type === 'folder' ? (
                <ChevronRight size={16} className="text-muted-foreground" />
              ) : (
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded hover:bg-accent transition-colors"
                  aria-label="その他のオプション"
                >
                  <MoreVertical size={14} className="text-muted-foreground" />
                </button>
              )}
            </div>
          </QItemSection>
        </QItem>
        {!isLast && <QSeparator inset="item" />}
      </div>
    )
  }

  return (
    <QList bordered>
      {/* フォルダセクション */}
      <QItemLabel header>フォルダ</QItemLabel>
      {folders.map((item, index) =>
        renderItem(item, index === folders.length - 1)
      )}

      {/* ファイルセクション */}
      <QSeparator spaced />
      <QItemLabel header>ファイル</QItemLabel>
      {files.map((item, index) => renderItem(item, index === files.length - 1))}
    </QList>
  )
}

export default FolderListDemo
