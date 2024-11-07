const PDFDocument = require('pdfkit')
const fs = require('fs')

function createPDF(data) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 70, left: 50, right: 50, bottom: 50 },
  })

  const file = doc.pipe(fs.createWriteStream(`uploads/${Date.now()}.pdf`))

  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#D3D3D3')

  const boxX = 50
  const boxY = 120
  const boxWidth = 500
  const boxHeight = 200
  doc.rect(boxX, boxY, boxWidth, boxHeight).fill('#2E2E2E')

  const paddingLeft = 20
  const paddingRight = 20
  const contentX = boxX + paddingLeft
  const contentWidth = boxWidth - paddingLeft - paddingRight
  const lineHeight = 30

  doc.fontSize(14).fillColor('#D3D3D3')

  function addLine(leftText, rightText, yPosition) {
    doc.text(leftText, contentX, yPosition, {
      width: contentWidth / 2,
      align: 'left',
    })
    doc.text(rightText, contentX + contentWidth / 2, yPosition, {
      width: contentWidth / 2,
      align: 'right',
    })
  }

  const titleBoxY = 70
  const titleBoxHeight = 40
  doc.rect(50, titleBoxY, boxWidth, titleBoxHeight).fill('#000000')

  doc
    .fontSize(18)
    .fillColor('#ffffff')
    .text("To'lov tafsiloti", 50, titleBoxY + 10, { align: 'center' })
  doc.moveDown()

  addLine("To'lovchi", data?.client_name, boxY + 20)
  addLine('Mahsulot', data?.product_name, boxY + 20 + lineHeight)
  addLine("To'lov oyi", data?.date, boxY + 20 + lineHeight * 2)
  addLine(
    "To'lov summasi",
    `${data?.payment_amount}$`,
    boxY + 20 + lineHeight * 3
  )
  addLine(
    'Qoldiq summa',
    `${data?.residue_amount}$`,
    boxY + 20 + lineHeight * 4
  )
  addLine('Qoldiq oy', `${data?.residue_month} oy`, boxY + 20 + lineHeight * 5)

  doc.end()

  return file.path.split('/')[1]
}

module.exports = createPDF
