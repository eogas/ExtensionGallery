﻿using System;
using System.Text;
using System.Xml;
using ExtensionGallery.Models;

namespace ExtensionGallery.Code
{
	public class FeedWriter
	{
		public string GetFeed(string baseUrl, params Package[] packages)
		{
			StringBuilder sb = new StringBuilder();
			XmlWriterSettings settings = new XmlWriterSettings
			{
				Indent = true
			};

			using (XmlWriter writer = XmlWriter.Create(sb, settings))
			{
				writer.WriteStartElement("feed", "http://www.w3.org/2005/Atom");

				writer.WriteElementString("title", "VSIX Gallery");
				writer.WriteElementString("id", "5a7c2525-ddd8-4c44-b2e3-f57ba01a0d81");
				writer.WriteElementString("updated", DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssZ"));

				foreach (Package package in packages)
				{
					AddEntry(writer, package, baseUrl);
				}

				writer.WriteEndElement(); // feed
			}

			return sb.ToString().Replace("utf-16", "utf-8");
		}

		private void AddEntry(XmlWriter writer, Package package, string baseUrl)
		{
			writer.WriteStartElement("entry");

			writer.WriteElementString("id", package.ID);

			writer.WriteStartElement("title");
			writer.WriteAttributeString("type", "text");
			writer.WriteValue(package.Name);
			writer.WriteEndElement(); // title

			writer.WriteStartElement("summary");
			writer.WriteAttributeString("type", "text");
			writer.WriteValue(package.Description);
			writer.WriteEndElement(); // summary

			writer.WriteElementString("published", package.DatePublished.ToString("yyyy-MM-ddTHH:mm:ssZ"));
			writer.WriteElementString("updated", package.DatePublished.ToString("yyyy-MM-ddTHH:mm:ssZ"));

			writer.WriteStartElement("author");
			writer.WriteElementString("name", package.Author);
			writer.WriteEndElement(); // author

			writer.WriteStartElement("content");
			writer.WriteAttributeString("type", "application/octet-stream");
			writer.WriteAttributeString("src", baseUrl + "/extensions/" + package.ID + "/extension.vsix");
			writer.WriteEndElement(); // content

			writer.WriteRaw("\r\n<Vsix xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns=\"http://schemas.microsoft.com/developer/vsx-syndication-schema/2010\">\r\n");

			writer.WriteElementString("Id", package.ID);
			writer.WriteElementString("Version", package.Version);

			writer.WriteStartElement("References");
			writer.WriteEndElement();

			writer.WriteRaw("</Vsix>");// Vsix
			writer.WriteEndElement(); // entry
		}
	}
}