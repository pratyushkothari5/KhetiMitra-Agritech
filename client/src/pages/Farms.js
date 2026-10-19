import Crud from '../components/Crud';
export default function Farms() {
  return (<>
    <Crud title="🏡 Farms" endpoint="/farms"
      fields={[{ name: 'name', label: 'Farm name' }, { name: 'location', label: 'Location' }, { name: 'areaAcres', label: 'Area (acres)', type: 'number' }, { name: 'soilType', label: 'Soil', options: ['Black', 'Red', 'Alluvial', 'Sandy', 'Loamy'] }]}
      columns={[['Name', r => r.name], ['Location', r => r.location], ['Acres', r => r.areaAcres], ['Soil', r => r.soilType]]} />
    <Crud title="🌱 Crops" endpoint="/crops"
      fields={[{ name: 'farm', label: 'Farm', ref: '/farms' }, { name: 'name', label: 'Crop' }, { name: 'season', label: 'Season', options: ['Kharif', 'Rabi', 'Zaid'] }, { name: 'status', label: 'Status', options: ['planned', 'growing', 'harvested'] }, { name: 'expectedYield', label: 'Yield (t/ha)', type: 'number' }, { name: 'sownOn', label: 'Sown on', type: 'date' }]}
      columns={[['Crop', r => r.name], ['Farm', r => r.farm?.name], ['Season', r => r.season], ['Status', r => <span className="badge bg-success">{r.status}</span>], ['Yield', r => r.expectedYield]]} />
  </>);
}
