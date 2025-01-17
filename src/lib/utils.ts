import { Row } from '@libsql/client/.'
import Excel from 'exceljs'

type ReportData = {
  data: Row[]
  month: string
}

export const createReportBase64 = async ({ data, month }: ReportData) => {
  const { Workbook } = Excel
  const workbook = new Workbook()
  workbook.creator = 'Brayan Yin Lin'
  const worksheet = workbook.addWorksheet(`Reporte Mes ${month}`)
  worksheet.columns = [
    { header: 'Producto', key: 'producto', width: 35 },
    { header: 'Unidad de Medida', key: 'unidad', width: 30 },
    { header: 'Cantidad', key: 'cantidad', width: 10 },
    { header: 'Fecha', key: 'fecha', width: 12 }
  ]

  const mappedData = data.map((record) => Object.values(record))

  worksheet.addTable({
    name: 'ReporteTable',
    ref: 'A1',
    headerRow: true,
    style: {
      theme: 'TableStyleMedium8',
      showRowStripes: true
    },
    columns: [
      { name: 'Producto' },
      { name: 'Unidad de Medida' },
      { name: 'Cantidad' },
      { name: 'Fecha' }
    ],
    rows: mappedData
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return buffer
}

export const getMonth = ({
  index,
  lang
}: {
  index: number
  lang: string
}): string => {
  const month = new Date(2024, index - 1).toLocaleString(lang ?? 'en-US', {
    month: 'long'
  })
  return month.charAt(0).toLocaleUpperCase() + month.slice(1).toLowerCase()
}
