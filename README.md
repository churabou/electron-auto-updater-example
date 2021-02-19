# electron-auto-update-example

### build version 1.0.0 app

```
yarn install
yarn dist
```

### build version 2.0.0 app

```
update version of package.json from 1.0.0 to 2.0.0
update build.directories.output of package.json from out/1.0.0 to out/2.0.0
yarn dist
```

### start update server


```
node_modules/.bin/http-server .out/2.0.0/ -p 8888
```

---

### start v1.0.0 app

start v1.0.0 app from `.out/1.0.0/....`.

### Log

Becouse of using electron-log, See

- on Linux: ~/.config/{app name}/logs/{process type}.log
- on macOS: ~/Library/Logs/{app name}/{process type}.log
 on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
