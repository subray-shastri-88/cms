import QRCodePDF from './QRCodePDF';

const GenerateQRCodePDF = ({ data }) => {
  return <QRCodePDF string={data} />;
};

export default GenerateQRCodePDF;
