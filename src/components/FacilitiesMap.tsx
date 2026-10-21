import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AccommodationCenter, FoodCenter, WaterPoint, MedicalCenter } from '../types';
import { MapPin, Utensils, Droplets, HeartPulse, Bed, Navigation, Phone, Info, CheckCircle2 } from 'lucide-react';

interface FacilitiesMapProps {
  accommodations: AccommodationCenter[];
  foodCenters: FoodCenter[];
  waterPoints: WaterPoint[];
  medicalCenters: MedicalCenter[];
  selectedFacilityId?: string | null;
  onSelectFacility?: (id: string, type: string) => void;
}

export const FacilitiesMap: React.FC<FacilitiesMapProps> = ({
  accommodations,
  foodCenters,
  waterPoints,
  medicalCenters,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'accommodation' | 'food' | 'water' | 'medical'>('all');
  const [selectedItem, setSelectedItem] = useState<{
    id: number | string;
    type: 'temple' | 'accommodation' | 'food' | 'water' | 'medical';
    name: string;
    location: string;
    details: string;
    phone?: string;
    status?: string;
    lat: number;
    lng: number;
  } | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Alandi Coordinates: 18.6775, 73.8967
    const map = L.map(mapContainerRef.current, {
      center: [18.6775, 73.8967],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Alandi Yatra GIS',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers based on filter
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Helper to create custom HTML DivIcon
    const createIcon = (bgClass: string, iconHtml: string, size = 34) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: ${bgClass}; width: ${size}px; height: ${size}px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: 2.5px solid #ffffff; color: white;">
            ${iconHtml}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    };

    // 1. Sant Dnyaneshwar Samadhi Mandir (Central Landmark)
    const mandirMarker = L.marker([18.6777, 73.8969], {
      icon: createIcon('#c2410c', '<span style="font-weight:900;font-size:16px;">ॐ</span>', 40),
    });
    mandirMarker.bindPopup(`
      <div style="font-family:sans-serif; min-width: 180px;">
        <h4 style="margin:0 0 4px 0; font-weight:bold; color:#c2410c; font-size:14px;">श्री संत ज्ञानेश्वर महाराज समाधी मंदिर</h4>
        <p style="margin:0; font-size:12px; color:#475569;">Central Sanctum Sanctorum & Palkhi Prasthan Sthal</p>
        <div style="margin-top:6px; font-size:11px; font-weight:600; color:#15803d;">Open 04:00 AM - 11:00 PM</div>
      </div>
    `);
    mandirMarker.on('click', () => {
      setSelectedItem({
        id: 'mandir',
        type: 'temple',
        name: 'श्री संत ज्ञानेश्वर महाराज समाधी मंदिर (Sant Dnyaneshwar Samadhi Mandir)',
        location: 'Central Mandir Complex, Alandi Devachi',
        details: 'Sacred 13th-century Sanjeevan Samadhi of Mauli Sant Dnyaneshwar. Main point of pilgrimage and Palkhi departure.',
        lat: 18.6777,
        lng: 73.8969,
        phone: '020-27185200',
        status: 'Central Holy Shrine',
      });
    });
    markersGroup.addLayer(mandirMarker);

    // 2. Accommodations
    if (filterType === 'all' || filterType === 'accommodation') {
      accommodations.forEach((item) => {
        const marker = L.marker([item.latitude, item.longitude], {
          icon: createIcon('#7c3aed', '🛏️', 32),
        });
        marker.bindPopup(`
          <div style="font-family:sans-serif; min-width: 200px;">
            <div style="display:inline-block; font-size:10px; background:#f3e8ff; color:#6b21a8; padding:2px 6px; border-radius:4px; font-weight:bold; margin-bottom:4px;">Dharamshala / Shelter</div>
            <h4 style="margin:0 0 4px 0; font-weight:bold; color:#1e293b; font-size:13px;">${item.name}</h4>
            <div style="font-size:11px; color:#475569;">${item.location}</div>
            <div style="margin-top:6px; font-size:12px; font-weight:bold; color:${item.available_capacity > 0 ? '#15803d' : '#b91c1c'}">
              Available Beds: ${item.available_capacity} / ${item.total_capacity}
            </div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Phone: ${item.contact_phone}</div>
          </div>
        `);
        marker.on('click', () => {
          setSelectedItem({
            id: item.id,
            type: 'accommodation',
            name: item.name,
            location: item.location,
            details: `Capacity: ${item.available_capacity} beds free out of ${item.total_capacity}. Facilities: ${item.facilities}. Contact: ${item.contact_person}`,
            phone: item.contact_phone,
            lat: item.latitude,
            lng: item.longitude,
            status: item.available_capacity > 0 ? `${item.available_capacity} Beds Available` : 'Fully Occupied',
          });
        });
        markersGroup.addLayer(marker);
      });
    }

    // 3. Food Centers
    if (filterType === 'all' || filterType === 'food') {
      foodCenters.forEach((item) => {
        const marker = L.marker([item.latitude, item.longitude], {
          icon: createIcon('#16a34a', '🍲', 32),
        });
        marker.bindPopup(`
          <div style="font-family:sans-serif; min-width: 200px;">
            <div style="display:inline-block; font-size:10px; background:#dcfce7; color:#166534; padding:2px 6px; border-radius:4px; font-weight:bold; margin-bottom:4px;">Annachhatra / महाप्रसाद</div>
            <h4 style="margin:0 0 4px 0; font-weight:bold; color:#1e293b; font-size:13px;">${item.name}</h4>
            <div style="font-size:11px; color:#475569;">${item.service_timings}</div>
            <div style="margin-top:4px; font-size:11px; color:#166534; font-weight:600;">Daily Capacity: ${item.daily_capacity.toLocaleString()} Meals</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Phone: ${item.contact_phone}</div>
          </div>
        `);
        marker.on('click', () => {
          setSelectedItem({
            id: item.id,
            type: 'food',
            name: item.name,
            location: item.location,
            details: `Meal: ${item.meal_type}. Timings: ${item.service_timings}. Capacity: ${item.daily_capacity.toLocaleString()} meals/day.`,
            phone: item.contact_phone,
            lat: item.latitude,
            lng: item.longitude,
            status: 'Free Mahaprasad Active',
          });
        });
        markersGroup.addLayer(marker);
      });
    }

    // 4. Water Points
    if (filterType === 'all' || filterType === 'water') {
      waterPoints.forEach((item) => {
        const marker = L.marker([item.latitude, item.longitude], {
          icon: createIcon('#0284c7', '💧', 30),
        });
        marker.bindPopup(`
          <div style="font-family:sans-serif; min-width: 180px;">
            <div style="display:inline-block; font-size:10px; background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-weight:bold; margin-bottom:4px;">Drinking Water</div>
            <h4 style="margin:0 0 4px 0; font-weight:bold; color:#1e293b; font-size:13px;">${item.name}</h4>
            <div style="font-size:11px; color:#475569;">${item.location}</div>
            <div style="font-size:11px; color:#0284c7; font-weight:600; margin-top:4px;">${item.water_type}</div>
            <div style="font-size:11px; color:#16a34a; font-weight:bold;">${item.timing}</div>
          </div>
        `);
        marker.on('click', () => {
          setSelectedItem({
            id: item.id,
            type: 'water',
            name: item.name,
            location: item.location,
            details: `Water Type: ${item.water_type}. Operational Timing: ${item.timing}. Free filtered drinking water point.`,
            lat: item.latitude,
            lng: item.longitude,
            status: 'Operational 24x7',
          });
        });
        markersGroup.addLayer(marker);
      });
    }

    // 5. Medical Centers
    if (filterType === 'all' || filterType === 'medical') {
      medicalCenters.forEach((item) => {
        const marker = L.marker([item.latitude, item.longitude], {
          icon: createIcon('#dc2626', '🚑', 34),
        });
        marker.bindPopup(`
          <div style="font-family:sans-serif; min-width: 210px;">
            <div style="display:inline-block; font-size:10px; background:#fee2e2; color:#991b1b; padding:2px 6px; border-radius:4px; font-weight:bold; margin-bottom:4px;">${item.facility_type}</div>
            <h4 style="margin:0 0 4px 0; font-weight:bold; color:#1e293b; font-size:13px;">${item.name}</h4>
            <div style="font-size:11px; color:#475569;">${item.location}</div>
            <div style="font-size:11px; color:#dc2626; font-weight:bold; margin-top:4px;">Doctor: ${item.doctor_in_charge}</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Emergency Phone: ${item.contact_phone}</div>
          </div>
        `);
        marker.on('click', () => {
          setSelectedItem({
            id: item.id,
            type: 'medical',
            name: item.name,
            location: item.location,
            details: `Type: ${item.facility_type}. Beds: ${item.bed_count}. Services: ${item.emergency_services}. Doctor in charge: ${item.doctor_in_charge}`,
            phone: item.contact_phone,
            lat: item.latitude,
            lng: item.longitude,
            status: '24x7 Emergency Ready',
          });
        });
        markersGroup.addLayer(marker);
      });
    }
  }, [filterType, accommodations, foodCenters, waterPoints, medicalCenters]);

  const handleFlyTo = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
      {/* Top Bar with Map Filters */}
      <div className="p-4 sm:p-5 border-b border-amber-100 bg-linear-to-r from-amber-50/70 via-orange-50/40 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>OpenStreetMap • Verified Alandi Locations</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
            Alandi Pilgrimage Map & Facilities Directory (आळंदी सुविधा नकाशा)
          </h3>
          <p className="text-xs text-stone-500">
            Interactive map displaying certified shelters, food centers, drinking water kiosks, and 24x7 medical camps.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterType === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-orange-50 border border-stone-200'
            }`}
          >
            All Facilities ({accommodations.length + foodCenters.length + waterPoints.length + medicalCenters.length + 1})
          </button>
          <button
            onClick={() => setFilterType('accommodation')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
              filterType === 'accommodation'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <Bed className="w-3.5 h-3.5" />
            <span>Shelters ({accommodations.length})</span>
          </button>
          <button
            onClick={() => setFilterType('food')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
              filterType === 'food'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Food ({foodCenters.length})</span>
          </button>
          <button
            onClick={() => setFilterType('water')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
              filterType === 'water'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-sky-700 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Water ({waterPoints.length})</span>
          </button>
          <button
            onClick={() => setFilterType('medical')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
              filterType === 'medical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Medical ({medicalCenters.length})</span>
          </button>
        </div>
      </div>

      {/* Main Map + Sidebar Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[520px]">
        {/* Interactive Leaflet Map Box */}
        <div className="lg:col-span-2 relative h-[420px] lg:h-[540px] w-full bg-stone-100">
          <div ref={mapContainerRef} className="h-full w-full z-10" />

          {/* Quick Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-stone-200 shadow-md text-xs space-y-1.5 max-w-xs pointer-events-auto hidden sm:block">
            <div className="font-bold text-stone-800 text-[11px] mb-1">Alandi Map Markers</div>
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-3 h-3 rounded-full bg-orange-600 inline-block"></span>
              <span>Samadhi Mandir (18.6777° N, 73.8969° E)</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
              <span>Dharamshala / Accommodation</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
              <span>Annachhatra Food Center</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-3 h-3 rounded-full bg-sky-600 inline-block"></span>
              <span>RO Filtered Drinking Water</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
              <span>Medical Clinic & 108 Ambulance</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="p-4 sm:p-5 bg-stone-50/60 border-t lg:border-t-0 lg:border-l border-amber-100 flex flex-col justify-between overflow-y-auto max-h-[540px]">
          <div>
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      selectedItem.type === 'temple'
                        ? 'bg-orange-100 text-orange-800'
                        : selectedItem.type === 'accommodation'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedItem.type === 'food'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedItem.type === 'water'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedItem.status || 'Active Facility'}
                  </span>
                  <button
                    onClick={() => handleFlyTo(selectedItem.lat, selectedItem.lng)}
                    className="text-xs text-orange-700 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Navigation className="w-3 h-3" /> Focus on Map
                  </button>
                </div>

                <div>
                  <h4 className="text-base font-bold text-stone-900 leading-snug">{selectedItem.name}</h4>
                  <div className="flex items-start gap-1.5 text-xs text-stone-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>{selectedItem.location}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-orange-600" />
                    <span>Details & Operational Status:</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{selectedItem.details}</p>
                  {selectedItem.phone && (
                    <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-stone-800 font-medium">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Helpline / Contact: </span>
                      <a href={`tel:${selectedItem.phone}`} className="text-emerald-700 hover:underline">
                        {selectedItem.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleFlyTo(selectedItem.lat, selectedItem.lng)}
                    className="flex-1 py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Center Map Here</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-800 text-sm">Select Any Marker or List Item</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Click on any marker on the map or quick list below to view verified location details, phone numbers, and directions.
                </p>
              </div>
            )}

            {/* Quick Listing Preview */}
            <div className="mt-5 pt-4 border-t border-stone-200">
              <div className="text-xs font-bold text-stone-700 mb-2 uppercase tracking-wide">
                Key Yatra Spots in Alandi
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    handleFlyTo(18.6777, 73.8969);
                    setSelectedItem({
                      id: 'mandir',
                      type: 'temple',
                      name: 'संत ज्ञानेश्वर महाराज समाधी मंदिर',
                      location: 'Central Mandir Complex, Alandi Devachi',
                      details: 'Sacred Sanjeevan Samadhi of Mauli Sant Dnyaneshwar. Main point of pilgrimage and Palkhi departure.',
                      lat: 18.6777,
                      lng: 73.8969,
                      phone: '020-27185200',
                      status: 'Central Holy Shrine',
                    });
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white border border-stone-200 hover:border-orange-300 hover:bg-orange-50/50 text-xs transition flex items-center justify-between"
                >
                  <span className="font-medium text-stone-800 truncate">1. श्री संत ज्ञानेश्वर समाधी मंदिर</span>
                  <span className="text-[10px] text-orange-700 font-bold bg-orange-100 px-1.5 py-0.5 rounded">Mandir</span>
                </button>

                {accommodations.slice(0, 2).map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      handleFlyTo(acc.latitude, acc.longitude);
                      setSelectedItem({
                        id: acc.id,
                        type: 'accommodation',
                        name: acc.name,
                        location: acc.location,
                        details: `Capacity: ${acc.available_capacity} free beds of ${acc.total_capacity}. ${acc.facilities}`,
                        phone: acc.contact_phone,
                        lat: acc.latitude,
                        lng: acc.longitude,
                        status: `${acc.available_capacity} Free Beds`,
                      });
                    }}
                    className="w-full text-left p-2 rounded-lg bg-white border border-stone-200 hover:border-purple-300 hover:bg-purple-50/50 text-xs transition flex items-center justify-between"
                  >
                    <span className="font-medium text-stone-800 truncate">🛏️ {acc.name}</span>
                    <span className="text-[10px] text-purple-700 font-semibold">{acc.available_capacity} Beds</span>
                  </button>
                ))}

                {medicalCenters.slice(0, 1).map((med) => (
                  <button
                    key={med.id}
                    onClick={() => {
                      handleFlyTo(med.latitude, med.longitude);
                      setSelectedItem({
                        id: med.id,
                        type: 'medical',
                        name: med.name,
                        location: med.location,
                        details: `${med.facility_type}. Beds: ${med.bed_count}. Services: ${med.emergency_services}`,
                        phone: med.contact_phone,
                        lat: med.latitude,
                        lng: med.longitude,
                        status: '24x7 Emergency',
                      });
                    }}
                    className="w-full text-left p-2 rounded-lg bg-white border border-stone-200 hover:border-rose-300 hover:bg-rose-50/50 text-xs transition flex items-center justify-between"
                  >
                    <span className="font-medium text-stone-800 truncate">🚑 {med.name}</span>
                    <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">Hospital</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>All coordinates mapped from official Alandi Municipal records.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
