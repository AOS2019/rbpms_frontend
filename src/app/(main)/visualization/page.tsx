export default function Visualization() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bridge Visualization</h1>

      <svg width="1000" height="450">
        {/* Example Pier */}
        <rect x="5" y="150" width="50" height="15" fill="grey" />
        <rect x="20" y="120" width="20" height="33" fill="grey" />
        {/* <rect x="20" y="50" width="20" height="70" fill="grey" opacity= "0.2" /> */}

        <rect x="200" y="150" width="50" height="15" fill="grey" />
        <rect x="215" y="120" width="20" height="33" fill="grey" />
        <rect x="215" y="50" width="20" height="70" fill="red" />

        
        <rect x="435" y="150" width="50" height="15" fill="grey" />
        <rect x="450" y="85" width="20" height="66" fill="grey" />
        <rect x="450" y="50" width="20" height="36" fill="green" />

        <rect x="600" y="150" width="50" height="15" fill="grey" />
        <rect x="615" y="120" width="20" height="33" fill="grey" />
        <rect x="615" y="50" width="20" height="70" fill="grey" opacity= "0.2" />
        
        
      </svg>
    </div>
  );
}