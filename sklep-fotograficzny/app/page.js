import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Sklep fotograficzny</h1>
      <br></br>
      <li>
        <Link href={'/produkty'}>Produkty</Link>
      </li>
    </div>
  );
}
