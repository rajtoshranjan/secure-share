import lodash from 'lodash';

export class TimeFormatter {
  static formatTimeToNow(date: Date | string): string {
    const targetDate = new Date(date);
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      return '0 seconds';
    }

    // Use lodash's built-in date formatting
    return lodash.capitalize(
      lodash
        .chain(diff)
        .thru((ms) => {
          const seconds = Math.floor(ms / 1000);
          const days = Math.floor(seconds / 86400);
          const hours = Math.floor((seconds % 86400) / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);

          return lodash.compact([
            days && `${days} day${days !== 1 ? 's' : ''}`,
            hours && `${hours} hr${hours !== 1 ? 's' : ''}`,
            minutes && `${minutes} min${minutes !== 1 ? 's' : ''}`,
          ]);
        })
        .join(', ')
        .value() || 'less than a minute',
    );
  }

  static formatDateTime(date: Date | string): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
}
