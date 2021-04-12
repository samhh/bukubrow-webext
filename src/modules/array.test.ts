import { mapByPredicate } from "~/modules/array"

describe("~/modules/array", () => {
  test("mapByPredicate", () => {
    const xs = [1, 2, 3, 4, 5]
    const ys = [1, 4, 3, 8, 5]
    const p: Predicate<number> = x => x % 2 === 0
    const f = (n: number): number => n * 2

    expect(mapByPredicate(f)(p)(xs)).toEqual(ys)
  })
})
