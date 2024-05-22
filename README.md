# Tauri + Solid + Typescript

This template should help get you started developing with Tauri, Solid and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

# 问题
妈的,用新技术问题就是多

我安卓更新了一个版本,突然就不能访问文件了,现在需要权限...
    https://github.com/tauri-apps/tauri/pull/9311

在AndroidManifest.xml中添加这2行可能有效
```
    <uses-permission    android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission    android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<meta-data android:name="ScopedStorage" android:value="true" />
```

# 软件核心思想 (todo)
背单词策略: 过滤策略
精准打击 需要背诵 和 记不住的单词
通过第一次1w单词,过滤下来3k单词,继续过滤到500单词,把精力放在少数记不住的单词上


通过 可见的分值 让我们清晰的知道, 这个单词是否需要投入更多的精力进行背诵 (对于大量复习,往往一个单词就看1~2秒钟,所以这可以让我们把精力投入到更弱的单词上)


标签系统,可以让我们更加精准打击 需要的单词 , 例如 词组...

解决痛点: 无法组织自己需要单独专门背诵的单词列表
