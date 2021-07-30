export default function compact<T>(array: T[]): Array<Exclude<T, undefined | null | false>> {
  return array.filter((x) => x) as any
}
