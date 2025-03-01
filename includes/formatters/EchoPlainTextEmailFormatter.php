<?php

class EchoPlainTextEmailFormatter extends EchoEventFormatter {
	protected function formatModel( EchoEventPresentationModel $model ) {

		$subject = EchoDiscussionParser::htmlToText( $model->getSubjectMessage()->parse() );

		$text = EchoDiscussionParser::htmlToText( $model->getHeaderMessage()->parse() );

		$text .= "\n\n";

		$bodyMsg = $model->getBodyMessage();
		if ( $bodyMsg ) {
			$text .= EchoDiscussionParser::htmlToText( $bodyMsg->parse() );
		}

		$primaryLink = $model->getPrimaryLink();

		$primaryUrl = wfExpandUrl( $primaryLink['url'], PROTO_CANONICAL );
		$colon = $this->msg( 'colon-separator' )->text();
		$text .= "\n\n{$primaryLink['label']}$colon <$primaryUrl>";

		foreach ( array_filter( $model->getSecondaryLinks() ) as $secondaryLink ) {
			$url = wfExpandUrl( $secondaryLink['url'], PROTO_CANONICAL );
			$text .= "\n\n{$secondaryLink['label']}$colon <$url>";
		}

		// Footer
		$text .= "\n\n{$this->getFooter()}";

		return array(
			'body' => $text,
			'subject' => $subject,
		);
	}

	/**
	 * @return string
	 */
	public function getFooter() {
		global $wgEchoEmailFooterAddress;

		$footerMsg = $this->msg( 'echo-email-plain-footer' )->text();
		$prefsUrl = SpecialPage::getTitleFor( 'Preferences', false, 'mw-prefsection-echo' )
			->getFullURL( '', false, PROTO_CANONICAL );
		$text = "--\n\n$footerMsg\n$prefsUrl";

		if ( strlen( $wgEchoEmailFooterAddress ) ) {
			$text .= "\n\n$wgEchoEmailFooterAddress";
		}

		return $text;
	}
}
