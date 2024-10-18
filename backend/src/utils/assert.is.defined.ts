export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Expected 'value' to be defined, but received ${value}`);
  }
}

// use it after 7:08:00
/**
 * consr authenticatedUserId = req.session.userId;
 * try {
 *  assertIsDefined(authenticatedUserId);
 * }
 * 
 * then check userId = authenticatedUserId
 */