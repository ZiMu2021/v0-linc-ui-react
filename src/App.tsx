/**
 * App - アプリケーションルートコンポーネント
 *
 * Quasar List コンポーネントライブラリのデモページ。
 * すべてのコンポーネントと使用例を一覧表示する。
 */

import type { FC } from 'react'
import { Github, BookOpen, Package } from 'lucide-react'
import BasicDemo from './components/demo/BasicDemo'
import ContactListDemo from './components/demo/ContactListDemo'
import SettingsDemo from './components/demo/SettingsDemo'
import EmailListDemo from './components/demo/EmailListDemo'
import FolderListDemo from './components/demo/FolderListDemo'
import ActiveStateDemo from './components/demo/ActiveStateDemo'
import DemoSection from './components/demo/DemoSection'

/** コンポーネント一覧バッジデータ */
const components = [
  { name: 'QList', desc: 'リストコンテナ' },
  { name: 'QItem', desc: 'リストアイテム' },
  { name: 'QItemSection', desc: 'セクション' },
  { name: 'QItemLabel', desc: 'ラベル' },
  { name: 'QSeparator', desc: '区切り線' },
  { name: 'QAvatar', desc: 'アバター' },
]

const App: FC = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ─── ヘッダー ─── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Package size={14} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              React List Components
            </span>
            <span className="hidden sm:inline-block text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Quasar インスパイア
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://quasar.dev/vue-components/list-and-list-items"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
              aria-label="Quasar ドキュメント"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">Quasar Docs</span>
            </a>
            <a
              href="https://github.com/ZiMu2021/v0-linc-ui-react"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
              aria-label="GitHub リポジトリ"
            >
              <Github size={14} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── メインコンテンツ ─── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* ヒーローセクション */}
        <div className="mb-12 pb-10 border-b">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              React + TypeScript コンポーネントライブラリ
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance mb-4">
              List & List Items
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Quasar Framework の{' '}
              <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">
                QList
              </code>{' '}
              コンポーネントを参考にした、React + TypeScript 向けのリスト UI
              ライブラリです。連絡先・設定・メール・ファイル管理など、
              あらゆるリスト表示シナリオに対応します。
            </p>

            {/* コンポーネントバッジ */}
            <div className="flex flex-wrap gap-2">
              {components.map((comp) => (
                <div
                  key={comp.name}
                  className="flex items-center gap-1.5 bg-card border rounded-lg px-3 py-1.5"
                >
                  <code className="text-xs font-mono text-primary font-semibold">
                    {`<${comp.name}>`}
                  </code>
                  <span className="text-xs text-muted-foreground">
                    {comp.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── デモセクション一覧 ─── */}

        <DemoSection
          title="基本的な使い方"
          description="QList の bordered・separator・dense プロパティを使った3パターンの基本表示。クリック可能なアイテムはホバー・フォーカスエフェクトを持ちます。"
          tags={['QList', 'QItem', 'QItemSection', 'QItemLabel']}
        >
          <BasicDemo />
        </DemoSection>

        <DemoSection
          title="アクティブ状態とダークモード"
          description="active プロパティで選択状態を表現し、activeClass でカスタムスタイルを適用。dark プロパティでダークテーマのサイドバーナビゲーションも実現できます。"
          tags={['active', 'activeClass', 'dark']}
        >
          <ActiveStateDemo />
        </DemoSection>

        <DemoSection
          title="連絡先リスト"
          description="QItemSection(avatar) にアバターとオンラインインジケーターを配置し、メインセクションには複数行のラベルを表示。サイドセクションにアクションボタンを追加した例。"
          tags={['QItemSection avatar', 'QItemLabel caption', 'separator']}
        >
          <ContactListDemo />
        </DemoSection>

        <DemoSection
          title="設定リスト"
          description="QSeparator の inset・spaced プロパティ、QItemLabel の header スタイル、トグルスイッチを組み合わせた設定画面の実装例。"
          tags={['QItemLabel header', 'QSeparator inset', 'QSeparator spaced']}
        >
          <SettingsDemo />
        </DemoSection>

        <DemoSection
          title="メール一覧"
          description="QItemLabel の lines プロパティで本文プレビューを1行に制限し、overline・caption・未読バッジを組み合わせたメールクライアント風リスト。"
          tags={['QItemLabel lines', 'QItemLabel caption', 'side top']}
        >
          <EmailListDemo />
        </DemoSection>

        <DemoSection
          title="フォルダ・ファイル一覧"
          description="ファイルタイプに応じたアイコンとカラーバリアントを持つファイルマネージャー風リスト。QItem の active プロパティによるハイライト表示も含みます。"
          tags={['QItemSection avatar', 'QItemLabel', 'bordered']}
        >
          <FolderListDemo />
        </DemoSection>
      </main>

      {/* ─── フッター ─── */}
      <footer className="border-t mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Quasar List &amp; List Items の React + TypeScript 実装。
            <a
              href="https://quasar.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Quasar Framework
            </a>{' '}
            のデザインパターンを参考にしています。
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>React 19</span>
            <span>TypeScript</span>
            <span>Vite</span>
            <span>Tailwind CSS v4</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
