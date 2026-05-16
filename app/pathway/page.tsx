'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import PathwayOpening from '@/components/threshold/PathwayOpening';
import PathwayContent from './PathwayContent';

function useIsReturn() {
  const [isReturn, setIsReturn] = useState(false);
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    try {
      const key = 'cxv_pathway_visited';
      const seen = sessionStorage.getItem(key);
      if (seen) {
        setIsReturn(true);
      } else {
        sessionStorage.setItem(key, '1');
      }
    } catch {
      // treat as first visit
    }
  }, []);

  return isReturn;
}

export default function PathwayPage() {
  const [openingComplete, setOpeningComplete] = useState(false);
  const isReturn = useIsReturn();

  return (
    <>
      {!openingComplete && (
        <PathwayOpening
          onComplete={() => setOpeningComplete(true)}
          isReturn={isReturn}
        />
      )}
      <div
        style={{
          opacity: openingComplete ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: openingComplete ? 'auto' : 'none',
          visibility: openingComplete ? 'visible' : 'hidden',
        }}
      >
        <Suspense fallback={null}>
          <PathwayContent />
        </Suspense>
      </div>
    </>
  );
}