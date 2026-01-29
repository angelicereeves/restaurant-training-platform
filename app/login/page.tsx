import LoginClient from "./loginClient"

type SearchParams = {
  next?: string | string[]
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const nextParam = Array.isArray(sp.next) ? sp.next[0] : sp.next
  const next = nextParam || "/r/demo/roles"

  return <LoginClient nextUrl={next} />
}
