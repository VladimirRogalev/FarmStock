import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FarmService } from '@/services/farm.service';
import FarmCreateModal from './FarmCreateModal';
import FarmForm from './FarmForm';
import { IFarm } from '@/types/types';

const initialFarmState: IFarm = {
	id: '',
	title: '',
	description: '',
	country: '',
	city: '',
	street: '',
	apartment: '',
	latitude: undefined,
	longitude: undefined,
	tags: '',
	coverImage: '',
	contactEmail: '',
	contactPhone: '',
	website: '',
};

const FarmerDashboard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [farm, setFarm] = useState<IFarm>(initialFarmState);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [saving, setSaving] = useState(false);
	const [noFarm, setNoFarm] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const bagsCount = 0;
	const ordersCount = 0;
	const revenue = 0;

	useEffect(() => {
		const fetchFarm = async () => {
			if (!user) return;
			try {
				const farmData = await FarmService.getMyFarm();
				setFarm(farmData);
				setNoFarm(false);
			} catch (e) {
				setFarm(initialFarmState);
				setNoFarm(true);
				toast.error('No farm found for this user.');
			} finally {
				setLoading(false);
			}
		};
		fetchFarm();
	}, [user]);

	const handleUpdateFarm = async (updatedFarm: IFarm) => {
		setSaving(true);
		try {
			const data = await FarmService.updateFarm(updatedFarm);
			setFarm(data);
			toast.success('Farm data updated successfully!');
			setEditMode(false);
		} catch (e: any) {
			toast.error(e?.response?.data?.message || 'Failed to update farm data');
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <div className="text-center py-10">Loading farm data...</div>;
	}

	return (
		<div className="min-h-screen bg-green-700 py-8">
			<div className="max-w-2xl mx-auto p-4">
				<h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">Hello, {user?.firstName || 'Farmer'}!</h1>
				<section className="mb-6 bg-white rounded-lg p-6 shadow flex flex-col sm:flex-row justify-around items-center gap-4">
					<div className="text-center">
						<div className="text-lg font-semibold text-gray-500">Surprise Bags</div>
						<div className="text-2xl font-bold text-green-700">{bagsCount}</div>
					</div>
					<div className="text-center">
						<div className="text-lg font-semibold text-gray-500">Orders</div>
						<div className="text-2xl font-bold text-green-700">{ordersCount}</div>
					</div>
					<div className="text-center">
						<div className="text-lg font-semibold text-gray-500">Revenue</div>
						<div className="text-2xl font-bold text-green-700">${revenue}</div>
					</div>
				</section>
				<nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
					<button
						className="bg-green-600 text-white px-4 py-3 rounded shadow hover:bg-green-700 font-semibold transition"
						onClick={() => navigate('/farmer/manage-bags')}
					>
						My Surprise Bags
					</button>
					<button
						className="bg-green-600 text-white px-4 py-3 rounded shadow hover:bg-green-700 font-semibold transition"
						onClick={() => navigate('/farmer/create-bag')}
					>
						Create Bag
					</button>
					<button
						className="bg-green-600 text-white px-4 py-3 rounded shadow hover:bg-green-700 font-semibold transition"
						onClick={() => navigate('/farmer/orders')}
					>
						My Orders
					</button>
					<button
						className="bg-green-600 text-white px-4 py-3 rounded shadow hover:bg-green-700 font-semibold transition"
						onClick={() => navigate('/profile')}
					>
						My Profile
					</button>
				</nav>
				<section className="bg-white rounded-lg shadow p-6 text-gray-800">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Farm Information</h2>
						{!editMode && !noFarm && (
							<button className="text-green-700 underline" onClick={() => setEditMode(true)}>
								Edit
							</button>
						)}
					</div>
					{noFarm ? (
						<div>
							<p className="text-red-600 mb-4">No farm found for this user.</p>
							<button
								className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold transition mb-4"
								onClick={() => setShowCreateModal(true)}
							>
								Create Farm
							</button>
							<FarmCreateModal
								open={showCreateModal}
								onClose={() => setShowCreateModal(false)}
								onCreated={(newFarm: IFarm) => {
									setFarm(newFarm);
									setNoFarm(false);
									setShowCreateModal(false);
									toast.success('Farm created successfully!');
								}}
								initialFarm={farm}
							/>
						</div>
					) : editMode ? (
						<FarmForm
							initialFarm={farm}
							onSubmit={handleUpdateFarm}
							onCancel={() => setEditMode(false)}
							loading={saving}
						/>
					) : (
						<div className="space-y-2">
							<div><b>Title:</b> {farm.title}</div>
							<div><b>Description:</b> {farm.description}</div>
							<div><b>Country:</b> {farm.country}</div>
							<div><b>City:</b> {farm.city}</div>
							<div><b>Street:</b> {farm.street}</div>
							{farm.apartment && <div><b>Apartment:</b> {farm.apartment}</div>}
							<div><b>Tags:</b> {farm.tags}</div>
							<div><b>Cover Image:</b> {farm.coverImage}</div>
							<div><b>Contact Email:</b> {farm.contactEmail}</div>
							<div><b>Contact Phone:</b> {farm.contactPhone}</div>
							<div><b>Website:</b> {farm.website}</div>
						</div>
					)}
				</section>
			</div>
		</div>
	);
};

export default FarmerDashboard;
