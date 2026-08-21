import React from 'react';

function ProfileInfo({ admin }) {
  const InfoCard = ({ icon, label, value, link }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 hover:shadow-md transition-all duration-200">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <i className={`${icon} text-blue-600 text-sm`}></i>
        </div>

        <span className="ml-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </span>
      </div>

      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 break-all font-medium"
        >
          {link}
        </a>
      ) : (
        <p className="text-slate-800 font-medium break-words">
          {value || 'N/A'}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <h3 className="text-lg font-bold text-white">
          Profile Information
        </h3>

        <p className="text-sm text-blue-100 mt-0.5">
          Personal and professional details
        </p>
      </div>

      <div className="p-4">

        {/* About Section */}
        <div className="mb-4">

          <h4 className="text-base font-semibold text-slate-800 mb-2">
            About
          </h4>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              {admin?.about || 'No information available'}
            </p>
          </div>

        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

          <InfoCard
            icon="fas fa-phone"
            label="Phone"
            value={admin?.mobile}
          />

          <InfoCard
            icon="fas fa-map-marker-alt"
            label="Country"
            value={admin?.country}
          />

          <InfoCard
            icon="fas fa-home"
            label="Address"
            value={admin?.address}
          />

          <InfoCard
            icon="fas fa-graduation-cap"
            label="Education"
            value={admin?.education}
          />

          <InfoCard
            icon="fas fa-briefcase"
            label="Experience"
            value={admin?.experience}
          />

          <InfoCard
            icon="fas fa-venus-mars"
            label="Gender"
            value={admin?.gender}
          />

          <InfoCard
            icon="fab fa-linkedin"
            label="LinkedIn"
            link={admin?.linkedIn}
          />

        </div>

      </div>

    </div>
  );
}

export default ProfileInfo;