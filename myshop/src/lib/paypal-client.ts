export function jmdToUsd(jmd: number, rate = 157): string {
  return (jmd / rate).toFixed(2)
}
