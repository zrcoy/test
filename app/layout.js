import { Inter } from 'next/font/google'
import CustomLayout from './components/CustomLayout'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Veo Test',
  description: 'This is a demo show using google map api',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomLayout>{children}</CustomLayout>
      </body>
    </html>
  )
}
