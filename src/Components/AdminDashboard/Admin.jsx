import React, { useState, useEffect } from 'react';
import Card from './Card';
import Chart from './Chart';
import NewProperties from './NewProperties';
import NewEnquiries from './NewEnquiries';

const Admin = () => {
  const sectionClass = 'flex flex-col gap-4 sm:gap-6 lg:gap-8 w-full';
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay (replace with actual data fetching logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2-second delay for demo
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
      {isLoading ? (
        <div className="animate-pulse">
          {/* Skeleton for Section 1: Card */}
          <section className="w-full mb-6">
            <div className="w-full h-[300px] bg-gray-200 rounded-lg"></div>
          </section>

          {/* Skeleton for Section 2: Chart, NewEnquiries, NewProperties */}
          <section className={`${sectionClass} lg:flex-row`}>
            <div className="w-full lg:w-[70%] lg:flex lg:flex-col lg:gap-4">
              {/* Skeleton for Chart */}
              <div className="w-full lg:w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
              {/* Skeleton for NewEnquiries */}
              <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
            </div>
            {/* Skeleton for NewProperties */}
            <div className="w-full lg:w-1/4 lg:ml-auto h-96 bg-gray-200 rounded-lg mt-4 lg:mt-0"></div>
          </section>
        </div>
      ) : (
        <>
          {/* Section 1: Card (Dashboard Overview) at the top */}
          <section className="w-full">
            <div className="w-full max-h-[300px] overflow-y-auto">
              <Card />
            </div>
          </section>

          {/* Section 2: Chart and NewEnquiries side by side, NewProperties to the far right */}
          <section className={`${sectionClass} lg:flex-row`}>
            <div className="w-full lg:w-[70%] lg:flex lg:flex-col lg:gap-4">
              <div className="w-full lg:w-full">
                <Chart />
              </div>
              <div className="w-full">
                <NewEnquiries />
              </div>
            </div>
            <div className="w-full lg:w-1/4 lg:ml-auto">
              <NewProperties />
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Admin;