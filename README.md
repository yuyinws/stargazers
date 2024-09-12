# ⭐️ Stargazers

Analyze and explore the stars of any GitHub user.

## Introduce

[Stargazers](https://star.yuy1n.io) is a web application that allows you to add unlimited GitHub accounts and analyze and explore the star list of these accounts.

![CleanShot 2023-08-28 at 21.35.29@2x](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/08/upgit_20230828_1693229767.png)

![CleanShot 2023-08-28 at 20.43.28@2x](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/08/upgit_20230828_1693226665.png)

![CleanShot 2023-08-28 at 20.55.31@2x](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/08/upgit_20230828_1693227392.png)

## Features

- Supports adding unlimited GitHub accounts.
- Supports adding accounts via various methods such as user search, GitHub OAuth, or one-click button (powered by [UserScript](#UserScript)).
- Supports querying based on star time, programming languages, repository information and more.
- Supports analyzing star lists.
- Dark mode support. 
- Mobile end support.

## UserScript

![CleanShot 2023-08-28 at 21.15.21@2x](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/08/upgit_20230828_1693228551.png)

[Install from greasyfork](https://greasyfork.org/en/scripts/474055-add-to-stargazers)

A UserScript that adds a button on the GitHub user profile page, allowing you to easily add it to stargazers.

## Troubleshooting
All data is stored in the browser's IndexedDB. If you encounter any unexpected errors, you can try to delete the IndexedDB either from the [settings page](http://stargazers.dev/settings/indexdb) or manually (F12-Application-IndexedDB), then refresh the page.

## Build with

[NextJS](https://nextjs.org/)

[shadcn/ui](https://ui.shadcn.com/docs/installation/next)

[IndexedDB](https://github.com/jakearchibald/idb)

[GitHub GraphQL API](https://docs.github.com/en/graphql)

[Vercel](https://vercel.com/)
