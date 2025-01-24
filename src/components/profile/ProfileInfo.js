import React from 'react'

function ProfileInfo({ admin }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Details</h3>
    <span className="font-medium">About:</span>
    <div className="flex items-center">
        <span className="ml-2 text-gray-800">
            {admin.about}
             </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="flex items-center">
            <i className="fas fa-phone text-gray-600 mr-2"></i>
            <span className="font-medium">Phone:</span>
            <span className="ml-2 text-gray-800">{admin.mobile}</span>
        </div>
        <div className="flex items-center">
            {/* <i class="fa fa-location-dot text-gray-600 mr-2"></i> */}
            <i class="fa fa-map-marker text-gray-600 mr-2" ></i>
            <span className="font-medium">Country:</span>
            <span className="ml-2 text-gray-800">{admin.country}</span>
        </div>
        <div className="flex items-center">
            <i className="fas fa-home text-gray-600 mr-2"></i>
            <span className="font-medium">Address:</span>
            <span className="ml-2 text-gray-800">{admin.address}</span>
        </div>

        <div className="flex items-center">
            <i className="fas fa-graduation-cap text-gray-600 mr-2"></i>
            <span className="font-medium">Education:</span>
            <span className="ml-2 text-gray-800">{admin.education}</span>
        </div>
        <div className="flex items-center">
            <i className="fas fa-briefcase text-gray-600 mr-2"></i>
            <span className="font-medium">Experience:</span>
            <span className="ml-2 text-gray-800">{admin.experience}</span>
        </div>
        <div className="flex items-center">
            <i className="fas fa-venus-mars text-gray-600 mr-2"></i>
            <span className="font-medium">Gender:</span>
            <span className="ml-2 text-gray-800">{admin.gender}</span>
        </div>
        <div className="flex items-center">
            <i className="fab fa-linkedin text-gray-600 mr-2"></i>
            <span className="font-medium">LinkedIn:</span>
            <a href={admin.linkedIn} className="ml-2 text-blue-500" target="_blank" rel="noopener noreferrer">
                {admin.linkedIn}
            </a>
        </div>
    </div>
</div>
  )
}

export default ProfileInfo