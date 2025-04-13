import { useState, useRef, useEffect } from 'react';

export default function JointAnnotationTool() {
  // Define complete skeleton structure with parent-child relationships
  const skeleton = [
    { id: "root", name: "root", parent: null, connected: ["hip"] },
    { id: "hip", name: "hip", parent: "root", connected: ["torso", "right_hip", "left_hip"] },
    { id: "torso", name: "torso", parent: "hip", connected: ["neck", "right_shoulder", "left_shoulder"] },
    { id: "neck", name: "neck", parent: "torso", connected: ["head"] },
    { id: "head", name: "head", parent: "neck", connected: ["left_eye", "right_eye"] },
    { id: "left_eye", name: "left_eye", parent: "head", connected: ["left_ear"] },
    { id: "right_eye", name: "right_eye", parent: "head", connected: ["right_ear"] },
    { id: "left_ear", name: "left_ear", parent: "left_eye", connected: [] },
    { id: "right_ear", name: "right_ear", parent: "right_eye", connected: [] },
    { id: "right_shoulder", name: "right_shoulder", parent: "torso", connected: ["right_elbow"] },
    { id: "right_elbow", name: "right_elbow", parent: "right_shoulder", connected: ["right_hand"] },
    { id: "right_hand", name: "right_hand", parent: "right_elbow", connected: [] },
    { id: "left_shoulder", name: "left_shoulder", parent: "torso", connected: ["left_elbow"] },
    { id: "left_elbow", name: "left_elbow", parent: "left_shoulder", connected: ["left_hand"] },
    { id: "left_hand", name: "left_hand", parent: "left_elbow", connected: [] },
    { id: "right_hip", name: "right_hip", parent: "hip", connected: ["right_knee"] },
    { id: "right_knee", name: "right_knee", parent: "right_hip", connected: ["right_foot"] },
    { id: "right_foot", name: "right_foot", parent: "right_knee", connected: [] },
    { id: "left_hip", name: "left_hip", parent: "hip", connected: ["left_knee"] },
    { id: "left_knee", name: "left_knee", parent: "left_hip", connected: ["left_foot"] },
    { id: "left_foot", name: "left_foot", parent: "left_knee", connected: [] }
  ];

  const [selectedJoint, setSelectedJoint] = useState(null);
  const [pose, setPose] = useState({
    nodes: [],
    edges: []
  });
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragJointId, setDragJointId] = useState(null);
  const [hoveredJoint, setHoveredJoint] = useState(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });
  const [yamlOutput, setYamlOutput] = useState("");

  // Initialize edges when skeleton changes
  useEffect(() => {
    // Create edges from the skeleton connections
    const createEdges = () => {
      const edges = [];
      skeleton.forEach(joint => {
        if (joint.connected && joint.connected.length > 0) {
          joint.connected.forEach(connectedId => {
            edges.push({
              from: joint.id,
              to: connectedId
            });
          });
        }
      });
      return edges;
    };

    setPose(prev => ({
      ...prev,
      edges: createEdges()
    }));
  }, []);

  const handleJointSelection = (joint) => {
    setSelectedJoint(joint);
  };

  const handleCanvasClick = (e) => {
    if (!selectedJoint || isDragging || !imageLoaded) return;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    
    // Get mouse position relative to SVG
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    
    // Check if the joint already exists
    const existingNodeIndex = pose.nodes.findIndex(node => node.id === selectedJoint.id);
    
    if (existingNodeIndex !== -1) {
      // Update existing node
      const updatedNodes = [...pose.nodes];
      updatedNodes[existingNodeIndex] = {
        ...updatedNodes[existingNodeIndex],
        position: { x: svgPoint.x, y: svgPoint.y }
      };
      
      setPose(prev => ({
        ...prev,
        nodes: updatedNodes
      }));
    } else {
      // Add new node
      setPose(prev => ({
        ...prev,
        nodes: [
          ...prev.nodes,
          {
            id: selectedJoint.id,
            label: selectedJoint.name,
            position: { x: svgPoint.x, y: svgPoint.y }
          }
        ]
      }));
    }
    
    setSelectedJoint(null);
  };

  const handlePointerDown = (e, jointId) => {
    if (!jointId || !imageLoaded) return;
    
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    
    setIsDragging(true);
    setDragJointId(jointId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dragJointId || !imageLoaded) return;
    
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    
    // Update node position
    const updatedNodes = pose.nodes.map(node => {
      if (node.id === dragJointId) {
        return {
          ...node,
          position: { x: svgPoint.x, y: svgPoint.y }
        };
      }
      return node;
    });
    
    setPose(prev => ({
      ...prev,
      nodes: updatedNodes
    }));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragJointId(null);
  };
  
  const handlePointerEnter = (jointId) => {
    setHoveredJoint(jointId);
  };
  
  const handlePointerLeave = () => {
    setHoveredJoint(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.match('image.*')) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Set canvas size based on image dimensions
        // but cap it at reasonable limits
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = height * (maxWidth / width);
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = width * (maxHeight / height);
          height = maxHeight;
        }
        
        setCanvasSize({ width, height });
        setUploadedImage(img);
        setImageLoaded(true);
        // Clear existing points when new image is loaded
        setPose(prev => ({
          ...prev,
          nodes: []
        }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const clearJoints = () => {
    setPose(prev => ({
      ...prev,
      nodes: []
    }));
  };

  const resetAll = () => {
    setPose(prev => ({
      ...prev,
      nodes: []
    }));
    setUploadedImage(null);
    setImageLoaded(false);
    setSelectedJoint(null);
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const getCompletionPercentage = () => {
    const totalJoints = skeleton.length;
    const placedCount = pose.nodes.length;
    return Math.round((placedCount / totalJoints) * 100);
  };

  const generateYaml = () => {
    if (!uploadedImage || pose.nodes.length === 0) return;
    
    // Transform nodes to the YAML format
    const skeletonData = pose.nodes.map(node => {
      const skeletonItem = skeleton.find(s => s.id === node.id);
      return {
        loc: [Math.round(node.position.x), Math.round(node.position.y)],
        name: node.label,
        parent: skeletonItem?.parent || null
      };
    });
    
    // Sort nodes to ensure parent nodes come before children
    const sortedSkeletonData = [];
    
    // First, add root
    const rootNode = skeletonData.find(item => item.name === "root");
    if (rootNode) sortedSkeletonData.push(rootNode);
    
    // Then add other nodes in parent-child order
    const processedNodes = new Set(rootNode ? ["root"] : []);
    
    // Keep processing until all nodes are included
    while (processedNodes.size < skeletonData.length) {
      let addedAny = false;
      
      for (const node of skeletonData) {
        if (processedNodes.has(node.name)) continue;
        
        // Add node if its parent is already processed
        if (node.parent === null || processedNodes.has(node.parent)) {
          sortedSkeletonData.push(node);
          processedNodes.add(node.name);
          addedAny = true;
        }
      }
      
      // If we couldn't add any nodes in this iteration, break to avoid infinite loop
      if (!addedAny) break;
    }
    
    // Build the YAML string
    let yaml = `height: ${Math.round(canvasSize.height)}\n`;
    yaml += `skeleton:\n`;
    
    sortedSkeletonData.forEach(node => {
      yaml += `- loc:\n`;
      yaml += `  - ${node.loc[0]}\n`;
      yaml += `  - ${node.loc[1]}\n`;
      yaml += `  name: ${node.name}\n`;
      yaml += `  parent: ${node.parent === null ? 'null' : node.parent}\n`;
    });
    
    yaml += `width: ${Math.round(canvasSize.width)}\n`;
    
    setYamlOutput(yaml);
    return yaml;
  };

  const exportYaml = () => {
    const yaml = generateYaml();
    if (!yaml) return;
    
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character-skeleton.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get node map for edge connections
  const nodeMap = pose.nodes.reduce((map, entry) => {
    map.set(entry.id, entry);
    return map;
  }, new Map());

  // Find nodes and edges for display
  const getSkeletonNodesForDisplay = () => {
    return skeleton.map(joint => {
      return {
        ...joint,
        isPlaced: pose.nodes.some(node => node.id === joint.id)
      };
    });
  };

  const displayableNodes = getSkeletonNodesForDisplay();

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-700">Step {step}/4: Mark the Character's Joints</h2>
            <span className="text-sm text-gray-500">{getCompletionPercentage()}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 rounded-full h-2" 
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left panel */}
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">MARK THE CHARACTER'S JOINTS</h1>
              <p className="mb-2 text-gray-600">
                Upload your character image and mark the joint positions.
              </p>
              
              <div className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload"
                  className="block w-full py-2 px-4 bg-blue-50 text-blue-700 rounded cursor-pointer text-center hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  {imageLoaded ? "Change Image" : "Upload Character Image"}
                </label>
                
                {imageLoaded && (
                  <button 
                    onClick={resetAll}
                    className="block w-full mt-2 py-2 px-4 bg-red-50 text-red-700 rounded cursor-pointer text-center hover:bg-red-100 transition-colors border border-red-200"
                  >
                    Remove Image & Reset
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold text-gray-700 mb-2">JOINT SELECTION</h3>
              <p className="text-sm text-gray-500 mb-4">
                Select a joint type, then click on the image to place it.
              </p>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {displayableNodes.map(joint => (
                  <button
                    key={joint.id}
                    onClick={() => handleJointSelection(joint)}
                    disabled={!imageLoaded}
                    className={`
                      w-full text-left p-2 rounded flex items-center
                      ${!imageLoaded ? 'opacity-50 cursor-not-allowed' : ''}
                      ${selectedJoint?.id === joint.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                      ${joint.isPlaced ? 'text-green-700' : 'text-gray-700'}
                    `}
                  >
                    <span className="w-6 h-6 flex items-center justify-center rounded-full border mr-2 text-xs font-bold" 
                      style={{
                        backgroundColor: joint.isPlaced ? '#e6fffa' : 'white',
                        borderColor: joint.isPlaced ? '#38b2ac' : '#cbd5e0'
                      }}
                    >
                      {joint.id.charAt(0).toUpperCase()}
                    </span>
                    {joint.name.replace(/_/g, ' ')}
                    {joint.isPlaced && (
                      <svg className="ml-auto w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">
                If your character doesn't have certain joints, you can skip them.
              </p>
              
              <div className="space-y-2">
                <button 
                  onClick={clearJoints}
                  disabled={!imageLoaded || pose.nodes.length === 0}
                  className={`
                    w-full bg-red-50 text-red-700 px-4 py-2 rounded transition-colors
                    ${(!imageLoaded || pose.nodes.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'}
                  `}
                >
                  Clear All Points
                </button>
                
                <button 
                  onClick={exportYaml}
                  disabled={!imageLoaded || pose.nodes.length === 0}
                  className={`
                    w-full bg-green-50 text-green-700 px-4 py-2 rounded transition-colors
                    ${(!imageLoaded || pose.nodes.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-100'}
                  `}
                >
                  Export Skeleton (YAML)
                </button>
              </div>
            </div>
          </div>
          
          {/* Right panel */}
          <div className="w-full md:w-2/3">
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="text-center mb-2">
                <h3 className="font-medium text-gray-700">
                  {!imageLoaded ? 'Upload an image to begin' : 
                   selectedJoint ? `Place the ${selectedJoint.name.replace(/_/g, ' ')} joint` : 
                   hoveredJoint ? `${hoveredJoint.replace(/_/g, ' ')}` :
                   'Select a joint from the list and place it on the image'}
                </h3>
              </div>
              
              <div 
                className="relative bg-gray-200 rounded-md mx-auto overflow-hidden"
                style={{ 
                  width: Math.min(canvasSize.width, 800), 
                  height: Math.min(canvasSize.height, 800),
                  maxWidth: '100%'
                }}
              >
                {imageLoaded ? (
                  <svg
                    ref={svgRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
                    onClick={handleCanvasClick}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    style={{ cursor: selectedJoint ? 'crosshair' : isDragging ? 'grabbing' : 'default' }}
                    className="w-full h-full"
                  >
                    {/* Background image */}
                    <image href={uploadedImage?.src} width={canvasSize.width} height={canvasSize.height} />
                    
                    {/* Edges */}
                    {pose.edges.map(({ from, to }) => {
                      const fromNode = nodeMap.get(from);
                      const toNode = nodeMap.get(to);
                      
                      if (!fromNode || !toNode) return null;
                      
                      return (
                        <g key={`${from}-${to}`}>
                          <line
                            x1={fromNode.position.x}
                            y1={fromNode.position.y}
                            x2={toNode.position.x}
                            y2={toNode.position.y}
                            stroke="white" 
                            strokeWidth="2"
                          />
                          <line
                            x1={fromNode.position.x}
                            y1={fromNode.position.y}
                            x2={toNode.position.x}
                            y2={toNode.position.y}
                            stroke={
                              isDragging && hoveredJoint && [from, to].indexOf(hoveredJoint) >= 0
                                ? "#3D92C7"
                                : "#0E2D52"
                            }
                            strokeWidth="4"
                          />
                        </g>
                      );
                    })}
                    
                    {/* Nodes */}
                    {pose.nodes.map((node) => (
                      <g key={node.id}>
                        <circle
                          cx={node.position.x}
                          cy={node.position.y}
                          r={5}
                          stroke="white"
                          strokeWidth="2"
                          fill={isDragging && dragJointId === node.id ? "#3D92C7" : "#0E2D52"}
                          onMouseDown={(e) => handlePointerDown(e, node.id)}
                          onMouseEnter={() => handlePointerEnter(node.label)}
                          onMouseLeave={handlePointerLeave}
                        />
                      </g>
                    ))}
                  </svg>
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="text-gray-500">Upload an image to start annotating</p>
                  </div>
                )}
              </div>
              
              <div className="text-center mt-2 text-sm text-gray-500">
                {imageLoaded ? (
                  <div>
                    {hoveredJoint ? 
                      hoveredJoint.replace(/_/g, ' ') : 
                      "Adjust by dragging the points • Click to place • " + pose.nodes.length + " of " + skeleton.length + " joints placed"
                    }
                  </div>
                ) : (
                  <div>
                    Upload an image to start placing joints
                  </div>
                )}
              </div>
            </div>
            
            {yamlOutput && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Generated YAML</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                  {yamlOutput}
                </pre>
              </div>
            )}
            
            <div className="flex justify-between">
              <button 
                onClick={prevStep}
                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                Previous
              </button>
              <button 
                onClick={nextStep}
                className={`
                  px-6 py-2 rounded flex items-center
                  ${imageLoaded ? 'bg-blue-800 text-white hover:bg-blue-900' : 'bg-blue-300 text-white cursor-not-allowed'}
                `}
                disabled={!imageLoaded}
              >
                Next 
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
