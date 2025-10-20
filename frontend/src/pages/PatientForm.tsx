import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import patientService, { PatientFormData } from '../services/patientService';
import toast from 'react-hot-toast';

const PatientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<PatientFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      allergies: '',
      chronicConditions: '',
    },
  });

  // Fetch patient data if editing
  const { data: patientData, isLoading: isLoadingPatient } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getPatient(Number(id)),
    enabled: isEditMode,
  });

  // Load patient data into form
  useEffect(() => {
    if (patientData?.data) {
      const patient = patientData.data;
      reset({
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth.split('T')[0],
        gender: patient.gender,
        bloodGroup: patient.bloodGroup || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        city: patient.city || '',
        state: patient.state || '',
        zipCode: patient.zipCode || '',
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
        insuranceProvider: patient.insuranceProvider || '',
        insurancePolicyNumber: patient.insurancePolicyNumber || '',
        allergies: patient.allergies || '',
        chronicConditions: patient.chronicConditions || '',
      });
    }
  }, [patientData, reset]);

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (data: PatientFormData) =>
      isEditMode
        ? patientService.updatePatient(Number(id), data)
        : patientService.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success(isEditMode ? 'Patient updated successfully' : 'Patient created successfully');
      navigate('/patients');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save patient');
    },
  });

  const onSubmit = (data: PatientFormData) => {
    saveMutation.mutate(data);
  };

  if (isEditMode && isLoadingPatient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/patients')}>
          Back
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEditMode ? 'Edit Patient' : 'Add New Patient'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditMode ? 'Update patient information' : 'Enter patient details'}
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name *"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name *"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: 'Date of birth is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Birth *"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="gender"
                control={control}
                rules={{ required: 'Gender is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Gender *"
                    fullWidth
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="bloodGroup"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Blood Group" fullWidth>
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Contact Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => <TextField {...field} label="Phone" fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <TextField {...field} label="Email" type="email" fullWidth />}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => <TextField {...field} label="Address" fullWidth multiline rows={2} />}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => <TextField {...field} label="City" fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => <TextField {...field} label="State" fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="zipCode"
                control={control}
                render={({ field}) => <TextField {...field} label="Zip Code" fullWidth />}
              />
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Emergency Contact
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContactName"
                control={control}
                render={({ field }) => <TextField {...field} label="Emergency Contact Name" fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContactPhone"
                control={control}
                render={({ field }) => <TextField {...field} label="Emergency Contact Phone" fullWidth />}
              />
            </Grid>

            {/* Insurance Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Insurance Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="insuranceProvider"
                control={control}
                render={({ field }) => <TextField {...field} label="Insurance Provider" fullWidth />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="insurancePolicyNumber"
                control={control}
                render={({ field }) => <TextField {...field} label="Policy Number" fullWidth />}
              />
            </Grid>

            {/* Medical Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Medical Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="allergies"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Allergies" fullWidth multiline rows={3} />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="chronicConditions"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Chronic Conditions" fullWidth multiline rows={3} />
                )}
              />
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={() => navigate('/patients')} disabled={saveMutation.isPending}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? 'Saving...' : isEditMode ? 'Update Patient' : 'Create Patient'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PatientForm;
