import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';

function EditClinicalTestScreen({ route, navigation }) {
  const { clinicalTestId } = route.params;
  console.log('clinicalTestId:', clinicalTestId);

  const [clinicalTestDetails, setClinicalTestDetails] = useState({
    bloodPressure: '',
    respiratoryRate: '',
    bloodOxygenLevel: '',
    heartbeatRate: '',
    chiefcomplaint: '',
    pastMedicalHistory: '',
    medicalDiagnosis: '',
    medicalPrescription: '',
    patientId: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClinicalTestDetails = async () => {
      try {
        const response = await axios.get(`https://group3-mapd713.onrender.com/api/clinical-tests/clinical-testsById/${clinicalTestId}`);
        console.log('API Response:', response.data);

        if (response.data.success && response.data.data) {
          // Extract and set clinical test details
          const testData = response.data.data;
          console.log('Test Data:', testData); // Add this line to log testData
          setClinicalTestDetails({
            bloodPressure: testData.bloodPressure.toString(),
            respiratoryRate: testData.respiratoryRate.toString(),
            bloodOxygenLevel: testData.bloodOxygenLevel.toString(),
            heartbeatRate: testData.heartbeatRate.toString(),
            chiefcomplaint: testData.chiefComplaint,
            pastMedicalHistory: testData.pastMedicalHistory,
            medicalDiagnosis: testData.medicalDiagnosis,
            medicalPrescription: testData.medicalPrescription,
            patientId: testData.patient ? testData.patient._id : '',
          });
          
        } else {
          // Handle the case where no data is found for the given clinical test ID
          console.warn('No clinical test data found for the provided ID.');
        }
      } catch (error) {
        console.error('Error fetching clinical test details:', error);
        Alert.alert('Error', 'Failed to fetch clinical test details. Please try again later.');
      } finally {
        // Set loading to false when the request is completed
        setIsLoading(false);
      }
    };

    fetchClinicalTestDetails();
  }, [clinicalTestId]);


  const handleUpdate = async () => {
    try {
      // Validate input fields
    if (!bloodPressure || !respiratoryRate || !bloodOxygenLevel || !heartbeatRate) {
      Alert.alert('Validation Error', 'Please fill in all vital signs fields.', [
        {
          text: 'OK',
        },
      ]);
      return;
    }
      // Validate the clinicalTestDetails before sending the request
      if (!isValidClinicalTestDetails(clinicalTestDetails)) {
        throw new Error('Invalid clinical test details. Please check your input.');
      }

      // Convert relevant fields to numbers
      const updatedClinicalTestDetails = {
        ...clinicalTestDetails,
        bloodPressure: Number(clinicalTestDetails.bloodPressure),
        respiratoryRate: Number(clinicalTestDetails.respiratoryRate),
        bloodOxygenLevel: Number(clinicalTestDetails.bloodOxygenLevel),
        heartbeatRate: Number(clinicalTestDetails.heartbeatRate),
        chiefComplaint: clinicalTestDetails.chiefcomplaint, // Rename to match the server's field name
        pastMedicalHistory: clinicalTestDetails.pastMedicalHistory,
        medicalDiagnosis: clinicalTestDetails.medicalDiagnosis,
        medicalPrescription: clinicalTestDetails.medicalPrescription,
        creationDateTime: new Date().toISOString(), // Current date and time in ISO format
        patientId: clinicalTestDetails.patient ? clinicalTestDetails.patient._id : '',
      };

      console.log('Updating with data:', updatedClinicalTestDetails);

      // Construct the URL
      const apiUrl = `https://group3-mapd713.onrender.com/api/clinical-tests/clinical-tests/${clinicalTestId}`;
      console.log('Update URL:', apiUrl);

      // Send the update request
      const response = await axios.put(apiUrl, updatedClinicalTestDetails);

      console.log('Update Response:', response.data);

      if (response.data.success) {
        // Navigate to the ClinicalTests screen after a successful update
        console.log('Clinical test details updated successfully!');
        navigation.navigate('ClinicalTests');
      } else {
        console.error('Failed to update clinical test details. Server response:', response.data);
        throw new Error('Failed to update clinical test details.');
      }
    } catch (error) {
      console.error('Error updating clinical test details:', error.message);
      Alert.alert('Error', 'Failed to update clinical test details. Please check your input and try again.');
    }
  };


  // Validate clinical test details function
  const isValidClinicalTestDetails = (details) => {
    // Add your validation logic here
    // For example, check if required fields are present and have valid values
    return (
      details.bloodPressure.trim() !== '' &&
      details.respiratoryRate.trim() !== '' &&
      details.bloodOxygenLevel.trim() !== '' &&
      details.heartbeatRate.trim() !== '' &&
      details.chiefcomplaint.trim() !== '' &&
      details.pastMedicalHistory.trim() !== '' &&
      details.medicalDiagnosis.trim() !== '' &&
      details.medicalPrescription.trim() !== ''
      // Add validation for other fields as needed
    );
  };

  const handleChange = (field, value) => {
    // Update the clinicalTestDetails state with the entered value
    setClinicalTestDetails({ ...clinicalTestDetails, [field]: value });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter Blood Pressure (X/Y mmHg)"
          value={clinicalTestDetails.bloodPressure}
          onChangeText={(text) => handleChange('bloodPressure', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Respiratory Rate (X/min)"
          value={clinicalTestDetails.respiratoryRate}
          onChangeText={(text) => handleChange('respiratoryRate', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Blood Oxygen Level (X%)"
          value={clinicalTestDetails.bloodOxygenLevel}
          onChangeText={(text) => handleChange('bloodOxygenLevel', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Heartbeat Rate (X/min)"
          value={clinicalTestDetails.heartbeatRate}
          onChangeText={(text) => handleChange('heartbeatRate', text)}
        />

        <TextInput
          style={styles.inputForMultilines}
          placeholder="Patient’s chief complaint"
          value={clinicalTestDetails.chiefcomplaint}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => handleChange('chiefcomplaint', text)}
        />
        <TextInput
          style={styles.inputForMultilines}
          placeholder="Patient’s past medical history"
          value={clinicalTestDetails.pastMedicalHistory}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => handleChange('pastMedicalHistory', text)}
        />

        <TextInput
          style={styles.inputForMultilines}
          placeholder="Medical diagnosis"
          value={clinicalTestDetails.medicalDiagnosis}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => handleChange('medicalDiagnosis', text)}
        />

        <TextInput
          style={styles.inputForMultilines}
          placeholder="Medical prescription"
          value={clinicalTestDetails.medicalPrescription}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => handleChange('medicalPrescription', text)}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleUpdate}>
          <Text style={styles.loginButtonText}>Update</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFE1E1',
  },
  input: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },

  inputForMultilines: {
    width: 300,
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },

  loginButton: {
    backgroundColor: '#ED1703',
    padding: 10,
    borderRadius: 10,
    width: 300,
    marginBottom: 30
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
  },

  scrollView: {
    backgroundColor: '#EFE1E1',
  },
});

export default EditClinicalTestScreen;
