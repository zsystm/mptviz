import React, {useState, useEffect, useRef} from "react";
import Tree from "react-d3-tree";
import "./TrieComponent.css";

interface TrieComponentProps {
  trieData: any; // Replace 'any' with the appropriate type if known
  isPanelVisible: boolean;
}

const chunkText = (text: string, chunkSize = 20) => {
  const regex = new RegExp(`.{1,${chunkSize}}`, "g");
  return text.match(regex) || [];
};

const renderCustomNode = ({ nodeDatum }: { nodeDatum: any }) => (
  <g>
    <circle r={15} fill="black"></circle>
    <text fill="white" strokeWidth="1" x="20" y="-10">
      {nodeDatum.name}
    </text>
    {nodeDatum.attributes &&
      Object.entries(nodeDatum.attributes).map(([key, value], index) => {
        const keyChunks = chunkText(key);
        const valueChunks = chunkText(value as string);
        return (
          <g key={index}>
            {keyChunks.map((chunk, chunkIndex) => (
              <text key={chunkIndex} fill="black" x="20" y={20 * (index + 1) + 15 * chunkIndex}>
                {chunk}
              </text>
            ))}
            {valueChunks.map((chunk, chunkIndex) => (
              <text
                key={chunkIndex}
                fill="blue"
                x="20"
                y={20 * (index + 1) + 15 * (keyChunks.length + chunkIndex)}
              >
                {chunk}
              </text>
            ))}
          </g>
        );
      })}
  </g>
);

const TrieComponent: React.FC<TrieComponentProps> = ({ trieData, isPanelVisible }) => {
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Function to update the container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (treeContainerRef.current) {
        const { clientWidth, clientHeight } = treeContainerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
        localStorage.setItem("treeDimensions", JSON.stringify({ width: clientWidth, height: clientHeight }));
      }
    };

    // Initialize dimensions on mount and update on window resize
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Load dimensions from local storage only on initial mount
  useEffect(() => {
    const savedDimensions = localStorage.getItem("treeDimensions");
    if (savedDimensions) {
      const parsedDimensions = JSON.parse(savedDimensions);
      setDimensions(parsedDimensions);
    }
  }, []); // Run only once on mount


  const nodeSize = { x: 250, y: 150 };
  
  if (!trieData) {
    return <div>No data to display</div>;
  }

  return (
    <div className={`tree-container ${isPanelVisible ? 'panel-visible' : 'panel-hidden'}`}
    ref={treeContainerRef}>
      <Tree
        data={trieData}
        orientation="vertical"
        nodeSize={nodeSize}
        translate={{ x: dimensions.width / 2, y: dimensions.height / 4 }}
        renderCustomNodeElement={renderCustomNode}
      />
    </div>
  );
};

export default TrieComponent;
