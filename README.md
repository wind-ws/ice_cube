

# IceCube
一款专门服务于 复习单词 的APP




# 程序员须知

## 如何运行项目

```bash
cd ./ice_cube 
yarn
yarn tauri android init
cargo tauri android dev
```

## 如何编译项目



## 前端使用的库
[NextUI](https://nextui.org/)
[Tailwind CSS](https://tailwindcss.com/)
[Framer Motion](https://www.framer.com/motion/)
[ant-mobile](https://mobile.ant.design/zh/)
[@tauri-apps/plugin-store](https://beta.tauri.app/2/reference/js/store/#entries)

# 项目迁移计划
## 原因
React 无法实现 大量列表渲染,保证元素动态高度变化
React 坑太多

## 注意事项
只用 tailwindcss 写样式, 不用那些组件库了(卡死了, 找个轻量级无样式的组件库也可以)


## 目标 [https://www.solidjs.com/](SolidJs)

## 目标 Rust
目前关注在 [https://docs.rs/leptos/latest/leptos/](leptos) 上


