



// import React from "react";

// const Map = ({ building }) => {
//   // Get the building's map URL or use a default
//   const mapUrl =
//     building?.mapViewUrl ||
//     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31108.758827434904!2d80.2365!3d13.0701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260e68aebd451%3A0x8cfb47d60ed6225e!2sKoyambedu%2C%20Chennai%2C%20Tamil%20Nadu%20600072%2C%20India!5e0!3m2!1sen!2sus!4v1712112549876!5m2!1sen!2sus";

//   return (
//     <div className="p-4">
//       <div className="w-full max-w-2xl">
//         <h1 className="p-4 text-2xl font-bold">Map View</h1>
//         <div className="relative w-full h-[250px] md:h-[300px] lg:h-[350px] border rounded-lg shadow-lg overflow-hidden">
//           <iframe
//             className="w-full h-full"
//             src={mapUrl}
//             allowFullScreen=""
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//             title="Property Location Map"
//           ></iframe>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Map;

import React from "react";

const Map = ({ building }) => {
  // Get the building's map URL or use a default
  const mapUrl =
    building?.mapViewUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31108.758827434904!2d80.2365!3d13.0701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260e68aebd451%3A0x8cfb47d60ed6225e!2sKoyambedu%2C%20Chennai%2C%20Tamil%20Nadu%20600072%2C%20India!5e0!3m2!1sen!2sus!4v1712112549876!5m2!1sen!2sus";

  return (
    <div className="p-4">
      <div className="w-full">
        <h1 className="p-4 text-2xl font-bold">Map View</h1>
        <div className="relative w-full h-[250px] md:h-[300px] lg:h-[325px] border rounded-lg shadow-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={mapUrl}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Property Location Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Map;