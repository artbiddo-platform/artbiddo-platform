'use client';

import { useState, useEffect } from 'react';
import { auctionTimer } from '@/lib/auctionTimer';

interface AuctionTimerProps {
  endDate: Date;
  artworkId: string;
  onTimeUp?: () => void;
  showExtension?: boolean;
  className?: string;
}

export default function AuctionTimer({ 
  endDate, 
  artworkId, 
  onTimeUp, 
  showExtension = true,
  className = '' 
}: AuctionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [formattedTime, setFormattedTime] = useState('');
  const [timeClass, setTimeClass] = useState('');
  const [isExtended, setIsExtended] = useState(false);
  const [showExtensionAlert, setShowExtensionAlert] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = auctionTimer.calculateTimeRemaining(endDate);
      setTimeRemaining(remaining);
      setFormattedTime(auctionTimer.formatTimeRemaining(remaining));
      setTimeClass(auctionTimer.getTimeStatusClass(remaining));

      // Verificar si se debe extender
      if (showExtension && remaining <= 300 && remaining > 0 && !isExtended) {
        auctionTimer.shouldExtendAuction(artworkId, remaining).then(shouldExtend => {
          if (shouldExtend) {
            setShowExtensionAlert(true);
            setIsExtended(true);
            
            // Ocultar alerta después de 5 segundos
            setTimeout(() => setShowExtensionAlert(false), 5000);
          }
        });
      }

      // Llamar callback cuando el tiempo se agota
      if (remaining <= 0 && onTimeUp) {
        onTimeUp();
      }
    };

    // Actualizar inmediatamente
    updateTimer();

    // Actualizar cada segundo
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate, artworkId, onTimeUp, showExtension, isExtended]);

  const getTimeIcon = () => {
    if (timeRemaining <= 0) return '⏰';
    if (auctionTimer.isSnipingWindow(timeRemaining)) return '🔥';
    if (auctionTimer.isLastMinute(timeRemaining)) return '⚡';
    if (timeRemaining <= 300) return '⚠️';
    return '⏱️';
  };

  const getTimeLabel = () => {
    if (timeRemaining <= 0) return 'Finalizada';
    if (auctionTimer.isSnipingWindow(timeRemaining)) return 'ÚLTIMA OPORTUNIDAD';
    if (auctionTimer.isLastMinute(timeRemaining)) return 'Finaliza en';
    if (timeRemaining <= 300) return 'Finaliza pronto';
    return 'Tiempo restante';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Alerta de extensión */}
      {showExtensionAlert && (
        <div className="absolute -top-12 left-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
          🎉 ¡Subasta extendida por actividad reciente!
        </div>
      )}

      {/* Contador principal */}
      <div className="flex items-center space-x-2">
        <span className="text-lg">{getTimeIcon()}</span>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium">
            {getTimeLabel()}
          </span>
          <span className={`text-lg font-bold ${timeClass}`}>
            {formattedTime}
          </span>
        </div>
      </div>

      {/* Barra de progreso visual */}
      {timeRemaining > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-1000 ${
              timeRemaining <= 30 ? 'bg-red-500' :
              timeRemaining <= 60 ? 'bg-orange-500' :
              timeRemaining <= 300 ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}
            style={{ 
              width: `${Math.max(0, Math.min(100, (timeRemaining / 86400) * 100))}%` 
            }}
          />
        </div>
      )}

      {/* Indicadores de estado */}
      {timeRemaining > 0 && (
        <div className="mt-2 flex items-center space-x-4 text-xs">
          {auctionTimer.isSnipingWindow(timeRemaining) && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold animate-pulse">
              🔥 SNIPING
            </span>
          )}
          {auctionTimer.isLastMinute(timeRemaining) && !auctionTimer.isSnipingWindow(timeRemaining) && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
              ⚡ ÚLTIMO MINUTO
            </span>
          )}
          {timeRemaining <= 300 && timeRemaining > 60 && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
              ⚠️ FINALIZA PRONTO
            </span>
          )}
        </div>
      )}

      {/* Información adicional */}
      {timeRemaining > 0 && timeRemaining <= 300 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 text-sm">💡</span>
            <div className="text-xs text-blue-800">
              <p className="font-semibold mb-1">Consejo:</p>
              <p>
                {auctionTimer.isSnipingWindow(timeRemaining) 
                  ? '¡Es tu última oportunidad! Puja ahora o pierde la subasta.'
                  : auctionTimer.isLastMinute(timeRemaining)
                  ? '¡Último minuto! Las pujas pueden extender la subasta automáticamente.'
                  : '¡Falta poco! Prepárate para pujar en los últimos momentos.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
