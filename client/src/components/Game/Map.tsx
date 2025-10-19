import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { State } from '../../types';
import './Game.css';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// Map FIPS codes to state abbreviations
const FIPS_TO_STATE: { [key: string]: string } = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', '10': 'DE',
  '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS',
  '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY',
  '37': 'NC', '38': 'ND', '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC',
  '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV',
  '55': 'WI', '56': 'WY'
};

interface MapProps {
  onStateClick: (stateAbbr: string) => void;
  completedStates: Set<string>;
  incorrectState: string | null;
  learnMode?: boolean;
  allStates?: State[];
}

const Map: React.FC<MapProps> = ({
  onStateClick,
  completedStates,
  incorrectState,
  learnMode = false,
  allStates = []
}) => {
  const getStateName = (stateAbbr: string): string => {
    const state = allStates.find(s => s.abbreviation === stateAbbr);
    return state ? state.name : '';
  };

  const getStateCapital = (stateAbbr: string): string => {
    const state = allStates.find(s => s.abbreviation === stateAbbr);
    return state ? state.capital : '';
  };

  const getFillColor = (stateAbbr: string): string => {
    if (incorrectState === stateAbbr) {
      return '#F44336'; // Red for wrong answer
    }
    if (completedStates.has(stateAbbr)) {
      return '#4CAF50'; // Green for completed
    }
    return '#ADD8E6'; // Default light blue
  };

  const getOpacity = (stateAbbr: string): number => {
    if (completedStates.has(stateAbbr) && incorrectState !== stateAbbr) {
      return 0.6; // Dimmed for completed states
    }
    return 1;
  };

  return (
    <div className="map-container" role="main" aria-label="Interactive US map">
      <ComposableMap
        projection="geoAlbersUsa"
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateAbbr = FIPS_TO_STATE[geo.id] || geo.id; // Convert FIPS code to state abbreviation
              const isCompleted = completedStates.has(stateAbbr);
              const isIncorrect = incorrectState === stateAbbr;

              return (
                <g key={geo.rsmKey}>
                  <Geography
                    geography={geo}
                    fill={getFillColor(stateAbbr)}
                    stroke="#FFF"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        fill: getFillColor(stateAbbr),
                        opacity: getOpacity(stateAbbr),
                        outline: 'none',
                      },
                      hover: {
                        fill: isCompleted ? getFillColor(stateAbbr) : '#87CEEB',
                        opacity: isCompleted ? 0.6 : 1,
                        outline: 'none',
                        cursor: isCompleted ? 'default' : 'pointer',
                      },
                      pressed: {
                        fill: getFillColor(stateAbbr),
                        outline: 'none',
                      },
                    }}
                    onClick={() => {
                      if (!isCompleted || learnMode) {
                        onStateClick(stateAbbr);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${getStateName(stateAbbr) || stateAbbr}${
                      isCompleted ? ' - completed' : ''
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && (!isCompleted || learnMode)) {
                        onStateClick(stateAbbr);
                      }
                    }}
                  />
                  {(isCompleted || learnMode) && (
                    <text
                      x={geo.properties.centroid?.[0] || 0}
                      y={geo.properties.centroid?.[1] || 0}
                      textAnchor="middle"
                      fill="white"
                      fontSize={8}
                      fontWeight="bold"
                      pointerEvents="none"
                      style={{ userSelect: 'none' }}
                    >
                      <tspan x={geo.properties.centroid?.[0] || 0} dy="-0.3em">
                        {getStateName(stateAbbr)}
                      </tspan>
                      {isCompleted && !learnMode && (
                        <tspan
                          x={geo.properties.centroid?.[0] || 0}
                          dy="1.2em"
                          fontSize={6}
                        >
                          {getStateCapital(stateAbbr)}
                        </tspan>
                      )}
                    </text>
                  )}
                </g>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default Map;
