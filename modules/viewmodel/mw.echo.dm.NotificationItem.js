( function ( mw, $ ) {
	/**
	 * Echo notification NotificationItem model
	 *
	 * @class
	 * @mixins OO.EventEmitter
	 *
	 * @constructor
	 * @param {number} id Notification id,
	 * @param {Object} [config] Configuration object
	 * @cfg {string} [iconUrl] A URL for the given icon.
	 * @cfg {string} [iconType] A string noting the icon type.
	 * @cfg {Object} [content] The message object defining the text for the header and,
	 *  optionally, the body of the notification.
	 * @cfg {string} [content.header=''] The header text of the notification
	 * @cfg {string} [content.body=''] The body text of the notification
	 * @cfg {string} [category] The category of this notification. The category identifies
	 *  where the notification originates from.
	 * @cfg {string} [type] The notification type 'message' or 'alert'
	 * @cfg {boolean} [read=false] State the read state of the option
	 * @cfg {boolean} [seen=false] State the seen state of the option
	 * @cfg {string} [timestamp] Notification timestamp in Mediawiki timestamp format
	 * @cfg {string} [primaryUrl] Notification primary link in raw url format
	 * @cfg {boolean} [external=false] This notification is from an external source
	 * @cfg {Object[]} [secondaryUrls] An array of objects defining the secondary URLs
	 *  for this notification. The secondary URLs are expected to have this structure:
	 *  	{
	 *  		"iconType": "userAvatar", // A symbolic name for the icon.
	 *  		                          // Will render as oo-ui-icon-* class.
	 *  		"label": "", // The label for the link
	 *  		"prioritized": true/false, // Prioritized links are outside of the popup
	 *  		                        // menu, whenever possible.
	 *  		"url": "..." // The url for the secondary link
	 *  	}
	 */
	mw.echo.dm.NotificationItem = function mwEchoDmNotificationItem( id, config ) {
		var date = new Date(),
			normalizeNumber = function ( number ) {
				return ( number < 10 ? '0' : '' ) + String( number );
			},
			fallbackMWDate = date.getUTCFullYear() +
				normalizeNumber( date.getMonth() ) +
				normalizeNumber( date.getUTCDate() ) +
				normalizeNumber( date.getUTCHours() ) +
				normalizeNumber( date.getUTCMinutes() ) +
				normalizeNumber( date.getUTCSeconds() );

		// Mixin constructor
		OO.EventEmitter.call( this );

		this.id = id !== undefined ? id : null;

		this.content = $.extend( { header: '', body: '' }, config.content );

		this.category = config.category || '';
		this.type = config.type || 'alert';
		this.external = !!config.external;
		this.iconType = config.iconType;
		this.iconURL = config.iconURL;

		this.read = !!config.read;
		this.seen = !!config.seen;

		this.timestamp = config.timestamp || fallbackMWDate;
		this.setPrimaryUrl( config.primaryUrl );
		this.setSecondaryUrls( config.secondaryUrls );
	};

	/* Inheritance */

	OO.mixinClass( mw.echo.dm.NotificationItem, OO.EventEmitter );

	/* Events */

	/**
	 * @event seen
	 * @param {boolean} [seen] Notification is seen
	 *
	 * Seen status of the notification has changed
	 */

	/**
	 * @event read
	 * @param {boolean} [read] Notification is read
	 *
	 * Read status of the notification has changed
	 */

	/* Methods */

	/**
	 * Get NotificationItem id
	 * @return {string} NotificationItem Id
	 */
	mw.echo.dm.NotificationItem.prototype.getId = function () {
		return this.id;
	};

	/**
	 * Get NotificationItem content header
	 * @return {string} NotificationItem content
	 */
	mw.echo.dm.NotificationItem.prototype.getContentHeader = function () {
		return this.content.header;
	};

	/**
	 * Get NotificationItem content body
	 * @return {string} NotificationItem content body
	 */
	mw.echo.dm.NotificationItem.prototype.getContentBody = function () {
		return this.content.body;
	};

	/**
	 * Get NotificationItem category
	 * @return {string} NotificationItem category
	 */
	mw.echo.dm.NotificationItem.prototype.getCategory = function () {
		return this.category;
	};
	/**
	 * Get NotificationItem type
	 * @return {string} NotificationItem type
	 */
	mw.echo.dm.NotificationItem.prototype.getType = function () {
		return this.type;
	};

	/**
	 * Check whether this notification item is read
	 * @return {boolean} Notification item is read
	 */
	mw.echo.dm.NotificationItem.prototype.isRead = function () {
		return this.read;
	};

	/**
	 * Check whether this notification item is seen
	 * @return {boolean} Notification item is seen
	 */
	mw.echo.dm.NotificationItem.prototype.isSeen = function () {
		return this.seen;
	};

	/**
	 * Check whether this notification item is external
	 * @return {boolean} Notification item is external
	 */
	mw.echo.dm.NotificationItem.prototype.isExternal = function () {
		return this.external;
	};

	/**
	 * Toggle the read state of the widget
	 *
	 * @param {boolean} [read] The current read state. If not given, the state will
	 *  become the opposite of its current state.
	 */
	mw.echo.dm.NotificationItem.prototype.toggleRead = function ( read ) {
		read = read !== undefined ? read : !this.read;
		if ( this.read !== read ) {
			this.read = read;
			this.emit( 'read', this.read );
			this.emit( 'sortChange' );
		}
	};

	/**
	 * Toggle the seen state of the widget
	 *
	 * @param {boolean} [seen] The current seen state. If not given, the state will
	 *  become the opposite of its current state.
	 */
	mw.echo.dm.NotificationItem.prototype.toggleSeen = function ( seen ) {
		seen = seen !== undefined ? seen : !this.seen;
		if ( this.seen !== seen ) {
			this.seen = seen;
			this.emit( 'seen', this.seen );
		}
	};

	/**
	 * Set the notification timestamp
	 *
	 * @param {number} timestamp Notification timestamp in Mediawiki timestamp format
	 */
	mw.echo.dm.NotificationItem.prototype.setTimestamp = function ( timestamp ) {
		this.timestamp = Number( timestamp );
		this.emit( 'sortChange' );
	};

	/**
	 * Get the notification timestamp
	 *
	 * @return {number} Notification timestamp in Mediawiki timestamp format
	 */
	mw.echo.dm.NotificationItem.prototype.getTimestamp = function () {
		return this.timestamp;
	};

	/**
	 * Set the notification link
	 *
	 * @param {string} link Notification url
	 */
	mw.echo.dm.NotificationItem.prototype.setPrimaryUrl = function ( link ) {
		this.primaryUrl = link;
	};

	/**
	 * Get the notification link
	 *
	 * @return {string} Notification url
	 */
	mw.echo.dm.NotificationItem.prototype.getPrimaryUrl = function () {
		return this.primaryUrl;
	};

	/**
	 * Get the notification icon URL
	 *
	 * @return {string} Notification icon URL
	 */
	mw.echo.dm.NotificationItem.prototype.getIconURL = function () {
		return this.iconURL;
	};

	/**
	 * Get the notification icon type
	 *
	 * @return {string} Notification icon type
	 */
	mw.echo.dm.NotificationItem.prototype.getIconType = function () {
		return this.iconType;
	};

	/**
	 * Set the notification's secondary links
	 * See constructor documentation for the structure of these links objects.
	 *
	 * @param {Object[]} links Secondary url definitions
	 */
	mw.echo.dm.NotificationItem.prototype.setSecondaryUrls = function ( links ) {
		this.secondaryUrls = links || [];
	};

	/**
	 * Get the notification's secondary links
	 *
	 * @return {Object[]} Secondary url definitions
	 */
	mw.echo.dm.NotificationItem.prototype.getSecondaryUrls = function () {
		return this.secondaryUrls;
	};
}( mediaWiki, jQuery ) );
