const LOIGenerator = ({ property, terms }) => {
  const generateLOI = () => {
    return `
      LETTER OF INTENT
      Property: ${property.address}
      Purchase Price: $${property.askingPrice.toLocaleString()}
      Deposit: $${(property.askingPrice * 0.05).toLocaleString()}
      Due Diligence Period: ${terms.ddPeriod} days
      Closing Date: ${new Date().toLocaleDateString()}
    `;
  };

  return (
    <div className="p-4 border rounded-lg">
      <textarea 
        value={generateLOI()} 
        className="w-full h-40 font-mono text-sm"
        readOnly
      />
      <button className="btn-primary mt-2">Download LOI</button>
    </div>
  );
};