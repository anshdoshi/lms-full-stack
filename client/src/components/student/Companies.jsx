import React from 'react';

const Companies = () => {
  const caOrganizations = [
    { name: 'ICAI', fullName: 'Institute of Chartered Accountants of India' },
    { name: 'Big 4', fullName: 'Deloitte, PwC, EY, KPMG' },
    { name: 'NFRA', fullName: 'National Financial Reporting Authority' },
    { name: 'SEBI', fullName: 'Securities and Exchange Board of India' },
    { name: 'MCA', fullName: 'Ministry of Corporate Affairs' },
  ];

  return (
    <div className="pt-16 pb-8">
      <p className="text-base text-gray-500 text-center mb-8">
        Preparing students for careers in
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {caOrganizations.map((org, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 min-w-[140px] md:min-w-[160px]"
          >
            <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-2">
              {org.name}
            </div>
            <div className="text-xs md:text-sm text-gray-600 text-center">
              {org.fullName}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-400 text-center mt-8">
        Trusted by aspiring Chartered Accountants across India
      </p>
    </div>
  );
};

export default Companies;
