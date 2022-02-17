# Image Similarity Search Frontend

Heutzutage gewinnt die Ähnlichkeitssuche auch in unserem Alltag mehr Bedeutung und ist somit fast nicht mehr wegzudenken.
Sie taucht in vielen verschiedenen Themenbereichen auf. Allein wenn wir im Internet etwas herumsurfen stoßen wir auf Werbung, die beispielsweise auf Grund von bestimmten Suchanfragen oder Käufen, für uns zusammengestellt wurde. Sie zeigt uns Dinge, die ähnlich aussehen wie, die die wir schon besitzen oder die uns potentiell gefallen könnten.
Auch dieses Projekt beschäftigt sich mit der Thematik der Ähnlichkeitssuche.
In dem Rahmen eines Semesters haben sich sechs Studenten zusammengefunden um gemeinsam an einer Singlepage-Applikation zu arbeiten.
Mit Hilfe von Back- und Frontend ließ sich eine Schnittstelle entwickeln, die es möglich gemacht hat mathematische Berechnungen benutzerfreundlich visuell darzustellen.
Man kann beliebige Bild-Datensätze in einem angepassten Koordinatensystem erkunden und sich einen genaueren Überblick über die bestimmten Daten geben lassen.
Es gibt die Möglichkeit sich die ähnlichsten Bilder eines bestimmten Bildes, ob hochgeladen oder ausgewählt, ausgeben zu lassen. Hier bekommt man detaillierte Informationen wie den Namen des Bildes, deren prozentuale Ähnlichkeit und die genaue Distanz.

Um die Applikation so benutzerfreundlich wie möglich zu gestalten wurde sich hier für die Verwendung von D3.js entschieden, um sich einen guten visuellen Überblick der Daten machen zu können. 
Unter Anderem gibt es zudem auch einige interessante Features, wie das semantische Zoomen oder das Hochladen einzelner Bilder, die man in die gewünschte Größe, mit Hilfe des Crops, bringen kann, als auch das gleichzeitige Uploaden mehrerer Bilder. 
Um auch bestimmte Klassifizierungen im Datensatz leichter finden zu können, gibt es die Option sich diese farblich gruppiert ausgeben zu lassen.

Zum Aufsetzen und Starten des Frontend Servers bitte die Schritte in [INSTALL.md](INSTALL.md) befolgen.

### Anmerkungen

Bei einer sehr großen Menge an Bildern ist die Anwendung je nach Leistung des Computers nicht mehr flüssig nutzbar. Dies liegt unter anderem am Zoom Feature, dessen Berechnung momentan auf den Bildern einzeln durchgeführt wird und somit sehr rechenintensiv ist. Diese Berechnungen sollten in Zukunft effizienter umgesetzt werden. Zum Beispiel dadurch das alle Bilder gruppiert werden und auf dieser Gruppe dann die Transformationen durchgeführt werden.

Das Streudiagramm, mit dem die Bilder angezeigt werden, passt seinen Maßstab an die Bildschirmauflösung an und sieht somit je nach Auflösung anders aus. Dadurch können die Abstände zwischen den Bilder in der Darstellung variieren.
