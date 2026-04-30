const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const buildQrPayload = (user, outpass) =>
  JSON.stringify(
    {
      studentName: user.name,
      registerNo: user.registerNo,
      fromDate: outpass.fromDate,
      toDate: outpass.toDate,
      status: outpass.status
    },
    null,
    2
  );

const createQrCodeDataUrl = async (user, outpass) => {
  const payload = buildQrPayload(user, outpass);
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 240
  });
};

const streamOutpassPdf = async (res, user, outpass) => {
  const qrCode = outpass.qrCode || (await createQrCodeDataUrl(user, outpass));
  const base64Image = qrCode.replace(/^data:image\/png;base64,/, '');
  const qrBuffer = Buffer.from(base64Image, 'base64');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=outpass-${user.registerNo || outpass._id}.pdf`
  );

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  doc.pipe(res);

  doc.fontSize(24).fillColor('#1E3A8A').text('HostelHub Outpass', {
    align: 'center'
  });
  doc.moveDown(1);
  doc.fontSize(11).fillColor('#475569').text('Official hostel gate outpass document', {
    align: 'center'
  });
  doc.moveDown(2);

  doc.roundedRect(40, 130, 515, 210, 16).fillAndStroke('#F8FAFC', '#E2E8F0');
  doc.fillColor('#0F172A').fontSize(16).text('Student Details', 60, 150);
  doc.fontSize(11);
  doc.text(`Name: ${user.name}`, 60, 180);
  doc.text(`Register No: ${user.registerNo || 'N/A'}`, 60, 200);
  doc.text(`Department: ${user.department || 'N/A'}`, 60, 220);
  doc.text(`Course: ${user.course || 'N/A'}`, 60, 240);
  doc.text(`Block / Room: ${user.blockNo || 'N/A'} / ${user.roomNo || 'N/A'}`, 60, 260);
  doc.text(`Mobile: ${user.mobile || 'N/A'}`, 60, 280);

  doc.text('Outpass Details', 60, 360, { underline: true });
  doc.text(`From Date: ${new Date(outpass.fromDate).toLocaleDateString()}`, 60, 390);
  doc.text(`To Date: ${new Date(outpass.toDate).toLocaleDateString()}`, 60, 410);
  doc.text(`Days: ${outpass.days}`, 60, 430);
  doc.text(`Destination: ${outpass.destination}`, 60, 450);
  doc.text(`Reason: ${outpass.reason}`, 60, 470, { width: 280 });
  doc.text(`Status: ${outpass.status.toUpperCase()}`, 60, 520);

  doc.image(qrBuffer, 380, 365, { fit: [140, 140] });
  doc.fontSize(10).fillColor('#64748B').text('Scan to validate outpass data', 380, 515, {
    width: 150,
    align: 'center'
  });

  doc.moveTo(360, 650).lineTo(520, 650).strokeColor('#94A3B8').stroke();
  doc.fontSize(11).fillColor('#0F172A').text('Admin Signature', 390, 660);

  doc.end();
};

module.exports = {
  buildQrPayload,
  createQrCodeDataUrl,
  streamOutpassPdf
};
