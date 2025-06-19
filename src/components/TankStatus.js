import React from 'react';
import './TankVisualizer.css';

export default function TankStatus({ tank, remaining }) {
  return (
    <div className="tank-container">
      {['petrol', 'diesel'].map((type) => {
        const percent = (remaining[type] / tank[type]) * 100;
        const lowFuel = percent < 10;

        const fuelLabel = type.charAt(0).toUpperCase() + type.slice(1);

        return (
          <div key={type} className="flex flex-col items-center">
            <div className={`tank ${type}`}>
              <div className="fluid" style={{ height: `${percent}%` }} />
              <div className="tank-label">
                {fuelLabel}: {remaining[type]}L / {tank[type]}L
              </div>
            </div>

            {lowFuel && (
              <div className="warning">
                ⚠️ Low {fuelLabel} Level
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
