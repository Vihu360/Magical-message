import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  cloud: {
    // Project: Testing
		projectID: 3713211,
    // Test runs with the same name groups test runs together.
    name: 'Testing1'
  }
};

export default function() {
	http.post('http://localhost:3000/sign-up');
  sleep(1);
}
