import { EquipmentRequest } from 'types/Request';

export const requestStatusToColor = {
  Requested: 'warning',
  Confirmed: 'success',
  'Signed Out': 'primary',
  Overdue: 'error',
  Returned: 'secondary',
  Cancelled: 'secondary',
};

/**
 * Given a list of equipment requests, convert any requests that have a status
 * of "Signed out" that has a return date prior to the current time to "Overdue"
 * @param requests A list of equipment requests
 */
export const setOverdueRequests = (requests: EquipmentRequest[]) => {
  requests.forEach((request) => {
    if (
      request.status === 'Signed Out' &&
      new Date(request.request_in) < new Date()
    ) {
      request.status = 'Overdue';
    }
  });
};

export const getRequestSortFn = (sortBy: string) => {
  return (a: EquipmentRequest, b: EquipmentRequest): number => {
    switch (sortBy) {
      case 'timestamp':
        return -a.timestamp.localeCompare(b.timestamp);
      case 'request_out':
        return -a.request_out.localeCompare(b.request_out);
      case 'request_in':
        return -a.request_in.localeCompare(b.request_in);
      case 'actual_out':
        if (a.actual_out === null && b.actual_out === null) {
          return 0;
        } else if (a.actual_out === null) {
          return -1;
        } else if (b.actual_out === null) {
          return 1;
        } else {
          return -a.actual_out.localeCompare(b.actual_out);
        }
      case 'actual_in':
        if (a.actual_in === null && b.actual_in === null) {
          return 0;
        } else if (a.actual_in === null) {
          return -1;
        } else if (b.actual_in === null) {
          return 1;
        } else {
          return -a.actual_in.localeCompare(b.actual_in);
        }
      case 'status':
        const statusPriority = {
          Overdue: 1,
          Requested: 2,
          Confirmed: 3,
          'Signed Out': 4,
          Returned: 5,
          Cancelled: 6,
        };
        return statusPriority[a.status] > statusPriority[b.status] ? 1 : -1;
      case 'project':
        return a.project > b.project ? 1 : -1;
      case 'user':
        return a.user > b.user ? 1 : -1;
      default:
        return 0;
    }
  };
};
