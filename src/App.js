import React, { useState, useEffect } from 'react';
import './App.css';
import { FaInfoCircle } from "react-icons/fa";

function App() {
  const [data, setData] = useState([]);
  const [hoveredContent, setHoveredContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://intradayscreener.com/api/openhighlow/cash');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleIconHover = (content) => {
    setHoveredContent(content);
    
  };
  
 

  const handleIconMouseLeave = () => {
    setHoveredContent('');
  };

  const renderMomentumCell = (item) => {
    const { low, high } = item;
    const deviation = high - low;
    const barWidth = (deviation / 100) * 200; 

    return (
      <td>
        <div className="range-bar">
          <div className="range-bar-fill" style={{ width: `${barWidth}%` }}></div>
          <div className="range-bar-values">
            <span>{low}</span>
            <span>{high}</span>
          </div>
        </div>
      </td>
    );
  };
  const renderMomentum = (item) => {
    const { stockOutperformanceRank, stockMomentumRank, sectorMomentumRank, sectorTodayRank } = item;
  
    return (
      <td style={{ backgroundColor: stockOutperformanceRank !== undefined ? 'transparent' : 'transparent' }}>
        <div >
          {stockOutperformanceRank !== undefined && (
            <span className='momentum-values' >{stockOutperformanceRank}</span>
          )}
          {stockMomentumRank !== undefined && (
            <span className='momentum-values'>{stockMomentumRank}</span>
          )}
          {sectorMomentumRank !== undefined && (
            <span className='momentum-values'>{sectorMomentumRank}</span>
          )}
          {sectorTodayRank !== undefined && (
            <span className='momentum-values'>{sectorTodayRank}</span>
          )}
        </div>
      </td>
    );
  };
  return (
    <div>
      <table>
        <thead>
        <tr className="heading">
        <th>SYMBOL <FaInfoCircle 
                          className='icon' 
                          onMouseOver={() => handleIconHover('Symbol information')}
                          onMouseOut={handleIconMouseLeave} /></th>
            <th>LTP <FaInfoCircle 
                        className='icon' 
                        onMouseOver={() => handleIconHover('Last Trading Price (LTP) information')}
                        onMouseOut={handleIconMouseLeave} /></th>
            <th>Momentum <FaInfoCircle 
                              className='icon' 
                              onMouseOver={() => handleIconHover('Momentum information')}
                              onMouseOut={handleIconMouseLeave} /></th>
            <th>OPEN <FaInfoCircle 
                          className='icon' 
                          onMouseOver={() => handleIconHover('Open information')}
                          onMouseOut={handleIconMouseLeave} /></th>
            <th>Deviation from Pivots <FaInfoCircle  
                                            className='icon' 
                                            onMouseOver={() => handleIconHover('Deviation from Pivots information')}
                                            onMouseOut={handleIconMouseLeave} /></th>
            <th>TODAYS RANGE <FaInfoCircle 
                                  className='icon' 
                                  onMouseOver={() => handleIconHover('Today\'s Range information')}
                                  onMouseOut={handleIconMouseLeave} /></th>
            <th>OHL</th>
</tr>
</thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td  style={{color:'blue',fontWeight:'bolder'}}>
                <input type="checkbox"></input>
                {item.symbol}
              </td>
              <td>{item.ltp}</td>
              {renderMomentum(item) }
              <td style={{paddingLeft:'60px'}}>{item.open}</td>
              <td>{item.deviation_from_pivots}</td>
              {renderMomentumCell(item)}
              {/* <td style={{color:'green'}} >{item.openHighLowSignal}</td> */}
              <td  style={{ color: item.openHighLowSignal === 'Open=Low' ? 'green' : 'red',backgroundColor:item.openHighLowSignal === 'Open=Low' ? 'rgb(219, 242, 219)' : 'rgb(228, 194, 191)' ,paddingLeft:'50px',borderRadius:'10px'}}>{item.openHighLowSignal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {hoveredContent && (
        <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
          {hoveredContent}
        </div>
      )}
    </div>
  );
}

export default App;
