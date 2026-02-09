import { useState, useEffect } from 'react';
import { Users, Phone, MapPin, AlertCircle } from 'lucide-react';
import { supabase, Beneficiary } from '../lib/supabase';

export default function BeneficiaryList() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .order('name');

      if (error) throw error;
      setBeneficiaries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span className="text-red-800">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Registered Beneficiaries</h2>
        <span className="text-sm text-gray-600">
          Total: {beneficiaries.length} | Active: {beneficiaries.filter(b => b.active).length}
        </span>
      </div>

      <div className="grid gap-4">
        {beneficiaries.map((beneficiary) => (
          <div
            key={beneficiary.id}
            className={`bg-white rounded-lg shadow-sm border p-4 ${
              beneficiary.active ? 'border-gray-200' : 'border-gray-300 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{beneficiary.name}</h3>
                  {!beneficiary.active && (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Card:</span>
                    <span>{beneficiary.ration_card_number}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{beneficiary.phone_number}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{beneficiary.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Family Members:</span>
                    <span>{beneficiary.family_members}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
