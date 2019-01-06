# zelda-error-alpha

## What is ZELDA_ERROR
なんかキャッチーな紹介文をいずれ書く

## このリポジトリについて
各フレームワーク用のZELDA_ERRORを、それぞれのサンプルプロジェクトとともに格納しています。  
すべてのフレームワークで、zelda-error/common/以下のソースは共通なので、多重メンテしてます。  
うまいことnpmモジュール化するにはどうしたらいいかわかんないの


- angular-zelda-error (view未実装)
- react-zelda-error
- react-native-zelda-error (作ってるけどサンプルプロジェクトがまだ)
- vue-zelda-error

サンプルプロジェクトの実行方法は各ディレクトリのREADME.mdを参照してください。

## How To ZELDA_ERROR
全フレームワーク共通の使い方

### ZELDA_ERROR コンポーネントのPropsの説明
- situation
  - issueの管理単位です。situationが切り替わるとissuesがリロードされます。
  - サンプルでは、vue-routerのrouteが切り替わった時にsituationを更新しています。
- locale
  - settings.localeLabelsから表示する言語を選択します。
  - 将来的に時刻系の何かをサポートする際にも参照する・・・かも
- showTicketLink
  - issue一覧にticketへのリンクを貼るかどうか
- settings
  - DBへのintegration等の挙動を注入
  - zelda-error-property-types.ts を読んでね
  - my-zelda-implementations.ts にミニマム実装が書かれています
    - GitLabへの投稿と、Slackへの通知は実際に動いています

### settings prop の変更
my-zelda-implementations.tsを書き換えればいろんなシステムに連携できます。  
連携ロジックは自前で書いてください。

でもせっかくなので、 common/zelda-error-sample-integrations/ 以下にある
- ZeldaErrorTicketGitLab
- ZeldaErrorNotificationSlack

等のバリエーションを増やす形で作っていただけるとそのまま再利用可能な形で公開できそうな予感がします。

## Futures
- AngularTS/JS へのview対応
- zelda-error-sample-integrations の充実
  - GitHub
  - JIRA
  - Trello
- ticketがcloseされたらZeldaIssueの状態も変更
  - GitLabでupdateイベント→GCP Functionでupdateする流れはできてるけど、リポジトリにうまく組み込めるだろうか。。。
- PatchNote 自動生成
  - これも現状、メッセージ生成してslackに自動投稿するツールはあるけど、どうやってリポジトリに組み込もう。。。
- ガジェットからステータス等変更
  - adminモードみたいなの実装して、管理者だとステータス変更できるみたいなやつ
