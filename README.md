# What is ZELDA_ERROR
なんかキャッチーな紹介文をいずれ書く

## このリポジトリについて
各フレームワーク用のZELDA_ERRORを、それぞれのサンプルプロジェクトとともに格納しています。 
サンプルプロジェクトの実行方法は各ディレクトリのREADME.mdを参照してください。

- angular-zelda-error
- react-zelda-error
- react-native-zelda-error (作ってはあるけどサンプルプロジェクトがまだ)
- vue-zelda-error
 
すべてのフレームワークで zelda-error/common/ 以下は同一ソースで動作しています。  
*[HELP ME!!]* zelda-error/common/ 以下のソースを1箇所に置きつつフレームワークごとにnpmモジュール化したい

## How To ZELDA_ERROR
### Props
- situation
  - issueの管理単位。situationが切り替わるとissuesリロードイベントが発火する
- locale
  - settings.localeLabelsから表示する言語を指定。デフォルトはen
- showTicketLink
  - issueからGitLabなどのticketへのリンクを貼るか
- settings
  - アプリ固有の挙動(DBへのintegration等)を注入
  - 詳しくは zelda-error-property-types.ts
  - my-zelda-implementations.ts にミニマム実装がある
    - GitLabへの投稿と、Slackへの通知は実際に動いている
    - そこ書いてある感じで、他のserviceへの連携も増やしていきたい

### my-zelda-implementations.ts
ここを書き換えればいろんなシステムに連携できます。  
基本、連携ロジックは自前で書いてもらうスタイル。

でも、 common/zelda-error-sample-integrations/ 以下にある
- ZeldaErrorTicketGitLab
- ZeldaErrorNotificationSlack

等のバリエーションを増やす形で作るとそのまま再利用可能な形で公開できそうな予感。

## Futures
- ReactNative 版も公開
- AngularJS(1.x) 版の開発
  - ts使えないってことはけっこう辛そう
- zelda-error-sample-integrations の充実
  - GitHub
  - JIRA
  - Trello
- (GitLab等で)ticketがcloseされたらZeldaIssueの状態も変更
  - GitLabでupdate hooking → GCPに置いたFunctionでupdateする流れはできてるけど、このリポジトリにどうやって置こうか。。。サンプル設定/実装としてReadmeでも書くか?
- PatchNote 自動生成
  - これも現状、メッセージ生成してslackに自動投稿するツールはあるけど、どうやってリポジトリに置こう。。。
- ZELDA_ERROR adminツール
  - issueの一覧とか統計が見られるやつ。これも今とりあえず自前で作ってるけど、うまいことリポジトリに(ry
- ガジェットからステータス等変更
  - adminモードみたいなの実装して、管理者でログインするとissueのステータス変更できるみたいなやつ

## LICENCE
This software is released under the MIT License, see LICENSE.txt.
