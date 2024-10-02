# Utility

## color

### type

```typescript

type ColorName =
| 'blue'
| 'gray'
| 'green'
| 'plum'
| 'orangered'
| 'red'
| 'olive'
| 'white'
| 'cyan'

type ColorInterface = {
  [color in ColorName]: ColorMethods
}

```


### intreface

```typescript

interface ColorMethods {
  (message: string): string
  bold: (message: string) => string
}
```
